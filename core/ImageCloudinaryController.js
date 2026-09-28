const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

/**
 * Drop-in replacement for ImageWordPressController — same method names
 * and response shapes (uploadImage, uploadBulkImages, updateImageFile,
 * deleteImage), so routes/media.js and the admin frontend don't need to
 * change at all. Uses Cloudinary instead of a WordPress media library,
 * so no WORDPRESS_APP_PASSWORD is needed.
 */
class ImageCloudinaryController {
    constructor(model, config) {
        this.model = model;
        this.config = config;

        cloudinary.config({
            cloud_name: config.cloudinary?.cloudName,
            api_key: config.cloudinary?.apiKey,
            api_secret: config.cloudinary?.apiSecret,
        });

        this.upload = multer({ storage: multer.memoryStorage() }).array("files", 20);
        this.uploadSingle = multer({ storage: multer.memoryStorage() }).single("file");
    }

    runMulterMiddleware = (req, res, isSingle = false) => {
        return new Promise((resolve, reject) => {
            const uploader = isSingle ? this.uploadSingle : this.upload;
            uploader(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    hasRootAccess(user) {
        return this.config.rootAccessRoles?.includes(user?.role);
    }

    uploadToCloudinary(buffer, mimetype, filename) {
        const base64 = `data:${mimetype};base64,${buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64, {
            folder: this.config.cloudinary?.folder || "home-tuition-near-me",
            public_id: filename.replace(/\.[^/.]+$/, ""),
        });
    }

    uploadImage = async (req, res) => {
        try {
            await this.runMulterMiddleware(req, res, true);
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });

            const createdBy = req?.user?._id;
            const fileName = req.file.originalname;

            const result = await this.uploadToCloudinary(req.file.buffer, req.file.mimetype, fileName);

            const imageData = new this.model({
                url: result.secure_url,
                providerId: result.public_id,
                alt: fileName,
                name: fileName,
                createdBy,
            });
            await imageData.save();

            return res.status(200).json({
                message: "Image uploaded successfully",
                data: imageData,
            });
        } catch (error) {
            console.error("Upload Error:", error?.response?.data || error.message);
            return res.status(400).json({
                message: "Image upload failed",
                data: error?.response?.data || error.message,
            });
        }
    };

    uploadBulkImages = async (req, res) => {
        try {
            await this.runMulterMiddleware(req, res, false);
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const createdBy = req?.user?._id;
            const results = [];

            for (const file of files) {
                try {
                    const result = await this.uploadToCloudinary(file.buffer, file.mimetype, file.originalname);
                    const imageData = new this.model({
                        url: result.secure_url,
                        providerId: result.public_id,
                        alt: file.originalname,
                        name: file.originalname,
                        createdBy,
                    });
                    await imageData.save();
                    results.push({ success: true, data: imageData });
                } catch (err) {
                    results.push({ success: false, error: err?.response?.data || err.message });
                }
            }

            return res.status(207).json({
                message: "Bulk upload completed",
                successCount: results.filter((r) => r.success).length,
                failureCount: results.filter((r) => !r.success).length,
                results,
            });
        } catch (error) {
            console.error("Bulk Upload Error:", error);
            return res.status(500).json({ message: "Bulk upload failed", error: error.message });
        }
    };

    updateImageFile = async (req, res) => {
        try {
            await this.runMulterMiddleware(req, res, true);
            const { id } = req.params;

            const imageDoc = await this.model.findById(id);
            if (!imageDoc) return res.status(404).json({ message: "Image not found" });

            const result = await this.uploadToCloudinary(
                req.file.buffer,
                req.file.mimetype,
                req.file.originalname
            );

            // Clean up the old Cloudinary asset now that the new one is live
            if (imageDoc.providerId) {
                await cloudinary.uploader.destroy(imageDoc.providerId).catch(() => {});
            }

            imageDoc.url = result.secure_url;
            imageDoc.providerId = result.public_id;
            imageDoc.name = req.file.originalname;
            imageDoc.alt = req.file.originalname;
            await imageDoc.save();

            return res.status(200).json({ message: "Image updated successfully", data: imageDoc });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Image update failed", error: error.message });
        }
    };

    deleteImage = async (req, res) => {
        try {
            const userId = req?.user?._id;
            const id = req.params.id;

            const query = this.hasRootAccess(req.user)
                ? { _id: id }
                : { _id: id, createdBy: userId };

            const imageDoc = await this.model.findOne(query);
            if (!imageDoc) {
                return res.status(404).json({ message: "Image not found or access denied." });
            }

            if (imageDoc.providerId) {
                await cloudinary.uploader.destroy(imageDoc.providerId).catch((err) => {
                    console.error("Cloudinary delete warning:", err.message);
                });
            }

            await this.model.findOneAndDelete(query);

            return res.status(200).json({
                message: "Image deleted successfully",
                data: { url: imageDoc.url, providerId: imageDoc.providerId },
            });
        } catch (error) {
            console.error("Delete Error:", error?.response?.data || error.message);
            return res.status(400).json({
                message: "Image deletion failed",
                data: error?.response?.data || error.message,
            });
        }
    };
}

module.exports = ImageCloudinaryController;

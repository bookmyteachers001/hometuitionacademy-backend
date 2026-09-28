// npm i multer sharp form-data axios
const multer = require("multer");
const sharp = require("sharp");
const FormData = require("form-data");
const axios = require("axios");

class ImageCloudflareController {
    constructor(model, config) {
        this.model = model;
        this.config = config;

        // Accept multiple files using key 'files'
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

    /**
     * Upload a single image to Cloudflare
     */
    uploadImage = async (req, res) => {
        try {
            await this.runMulterMiddleware(req, res, true);
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });


            const createdBy = req?.user?._id;
            const fileName = req.file.originalname;
            const mimeType = req.file.mimetype;

            const buffer = await sharp(req.file.buffer)
                .jpeg({ quality: this.config.quality?.sharpQuality || 80 })
                .toBuffer();

            const form = new FormData();
            form.append("file", buffer, {
                filename: fileName,
                contentType: mimeType
            });

            const uploadRes = await axios.post(
                `https://api.cloudflare.com/client/v4/accounts/${this.config.cloudflare.accountId}/images/v1`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${this.config.cloudflare.apiToken}`,
                        ...form.getHeaders()
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            const result = uploadRes.data.result;

            const imageData = new this.model({
                url: `${this.config.cloudflare.imageBaseUrl}/${result.id}/public`,
                providerId: result.id,
                alt: fileName,
                name: fileName,
                createdBy
            });

            await imageData.save();

            return res.status(200).json({
                message: "Image uploaded successfully",
                data: imageData
            });

        } catch (error) {
            console.error("Upload Error:", error?.response?.data || error.message);
            return res.status(400).json({
                message: "Image upload failed",
                data: error?.response?.data || error.message
            });
        }
    };

    /**
     * Upload multiple images (bulk)
     */
    uploadBulkImages = async (req, res) => {
        try {
            await this.runMulterMiddleware(req, res, false);
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({ message: "No files uploaded" });
            }

            const createdBy = req?.user?._id;
            const results = [];

            const delay = (ms) => new Promise((res) => setTimeout(res, ms));
            const maxRetries = this.config.cloudflare.maxRetries || 5;
            const delayMs = this.config.cloudflare.rateLimitDelayMs || 1000;

            for (const file of files) {
                try {
                    const fileName = file.originalname;
                    const mimeType = file.mimetype;

                    const buffer = await sharp(file.buffer)
                        .jpeg({ quality: this.config.quality?.sharpQuality || 80 })
                        .toBuffer();

                    const form = new FormData();
                    form.append("file", buffer, {
                        filename: fileName,
                        contentType: mimeType
                    });

                    let attempt = 0;
                    let success = false;
                    let uploadRes;

                    while (attempt < maxRetries && !success) {
                        try {
                            uploadRes = await axios.post(
                                `https://api.cloudflare.com/client/v4/accounts/${this.config.cloudflare.accountId}/images/v1`,
                                form,
                                {
                                    headers: {
                                        Authorization: `Bearer ${this.config.cloudflare.apiToken}`,
                                        ...form.getHeaders()
                                    },
                                    maxContentLength: Infinity,
                                    maxBodyLength: Infinity
                                }
                            );
                            success = true;
                        } catch (err) {
                            if (err.response?.status === 429) {
                                const waitTime = delayMs * Math.pow(2, attempt); // Exponential backoff
                                console.warn(`429 rate limit. Retry in ${waitTime}ms...`);
                                await delay(waitTime);
                                attempt++;
                            } else {
                                throw err;
                            }
                        }
                    }

                    if (!success) throw new Error("Max retry attempts reached due to rate limiting");

                    const result = uploadRes.data.result;

                    const imageData = new this.model({
                        url: `${this.config.cloudflare.imageBaseUrl}/${result.id}/public`,
                        providerId: result.id,
                        alt: fileName,
                        name: fileName,
                        createdBy
                    });

                    await imageData.save();
                    results.push({ success: true, data: imageData });

                    // Optional static delay to avoid 429
                    await delay(delayMs);

                } catch (err) {
                    results.push({
                        success: false,
                        error: err?.response?.data || err.message
                    });
                }
            }

            return res.status(207).json({
                message: "Bulk upload completed",
                successCount: results.filter(r => r.success).length,
                failureCount: results.filter(r => !r.success).length,
                results
            });

        } catch (error) {
            console.error("Bulk Upload Error:", error);
            return res.status(500).json({
                message: "Bulk upload failed",
                error: error.message
            });
        }
    };

    /**
     * Delete an image from Cloudflare + MongoDB
     */
    deleteImage = async (req, res) => {
        try {
            const userId = req?.user?._id;
            const id = req.params.id;

            const query = this.hasRootAccess(req.user)
                ? { providerId: id }
                : { providerId: id, createdBy: userId };

            const imageDoc = await this.model.findOneAndDelete(query);
            if (!imageDoc) {
                return res.status(404).json({ message: "Image not found or access denied." });
            }

            const deleteRes = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${this.config.cloudflare.accountId}/images/v1/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${this.config.cloudflare.apiToken}`
                    }
                }
            );

            const deleteJson = await deleteRes.json();
            if (!deleteJson.success) throw deleteJson;

            return res.status(200).json({
                message: "Image deleted successfully",
                data: deleteJson.result
            });
        } catch (error) {
            return res.status(400).json({
                message: "Image deletion failed",
                data: error
            });
        }
    };
}

module.exports = ImageCloudflareController;






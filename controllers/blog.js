const mongoose = require("mongoose");

const Category = require("../models/Category.js");
const SubCategory = require("../models/SubCategory.js");
const ChildCategory = require("../models/ChildCategory.js");
const Blog = require("../models/Blog.js");
const { pagination } = require("../helper/index.js");


// =====================================================
// CATEGORY
// =====================================================

const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);

        await category.save();

        return res.status(201).json({
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Category id is required",
            });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Category id is required",
            });
        }

        const category = await Category.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Category deleted successfully",
            data: category,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const getCategories = async (req, res) => {
    try {
        let filter = {};

        const { limit, skip } = pagination(req);

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const categoryCount = await Category.countDocuments(filter);

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
            count: categoryCount,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// SUB CATEGORY
// =====================================================

const createSubCategory = async (req, res) => {
    try {
        const subCategory = new SubCategory(req.body);

        await subCategory.save();

        return res.status(201).json({
            message: "SubCategory created successfully",
            data: subCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "SubCategory id is required",
            });
        }

        const subCategory = await SubCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "SubCategory updated successfully",
            data: subCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "SubCategory id is required",
            });
        }

        const subCategory = await SubCategory.findByIdAndDelete(id);

        return res.status(200).json({
            message: "SubCategory deleted successfully",
            data: subCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const getSubCategories = async (req, res) => {
    try {
        let filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const { limit, skip } = pagination(req);

        const subCategories = await SubCategory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const subCategoryCount =
            await SubCategory.countDocuments(filter);

        return res.status(200).json({
            message: "SubCategories fetched successfully",
            data: subCategories,
            count: subCategoryCount,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// CHILD CATEGORY
// =====================================================

const createChildCategory = async (req, res) => {
    try {
        const childCategory = new ChildCategory(req.body);

        await childCategory.save();

        return res.status(201).json({
            message: "ChildCategory created successfully",
            data: childCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const updateChildCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ChildCategory id is required",
            });
        }

        const childCategory =
            await ChildCategory.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );

        return res.status(200).json({
            message: "ChildCategory updated successfully",
            data: childCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const deleteChildCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "ChildCategory id is required",
            });
        }

        const childCategory =
            await ChildCategory.findByIdAndDelete(id);

        return res.status(200).json({
            message: "ChildCategory delete successfully",
            data: childCategory,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const getChildCategories = async (req, res) => {
    try {
        let filter = {};

        if (req.query.subCategory) {
            filter.subCategory = req.query.subCategory;
        }

        const { limit, skip } = pagination(req);

        const childCategories = await ChildCategory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const childCategoryCount =
            await ChildCategory.countDocuments(filter);

        return res.status(200).json({
            message: "ChildCategories fetched successfully",
            data: childCategories,
            count: childCategoryCount,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// BLOG - ADMIN
// =====================================================

const createBlog = async (req, res) => {
    try {
        const slug = req.body.slug;

        const isExist = await Blog.findOne({ slug });

        if (isExist) {
            return res.status(400).json({
                message: "Blog already exists with this title",
            });
        }

        const blog = new Blog({
            ...req.body,
            user: req.user._id,
        });

        await blog.save();

        return res.status(201).json({
            message: "Blog created successfully",
            data: blog,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const isExists = await Blog.findById(id);

        if (!isExists) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


const getBlogList = async (req, res) => {
    try {
        let filter = {};

        let select =
            "title description slug category subCategory childCategory user thumbnail published createdAt shortTitle";

        if (!req.user) {
            filter.published = true;
            filter.type = { $exists: false };
        }

        // Category filter
        if (req.query.category && req.query.category !== "all") {

            const categorySlug = String(req.query.category)
                .trim()
                .toLowerCase();

            const cat = await Category.findOne({
                slug: {
                    $regex: `^${categorySlug}$`,
                    $options: "i",
                },
            });

            if (!cat) {
                return res.status(404).json({
                    message: "Category not found",
                    slug: categorySlug,
                });
            }

            filter.category = cat._id;
        }

        if (req.query.select) {
            select = req.query.select;
        }

        if (req.query.subCategory) {
            filter.subCategory = req.query.subCategory;
        }

        if (req.query.childCategory) {
            filter.childCategory = req.query.childCategory;
        }

        if (req.query.type) {
            filter.type = req.query.type;
        }

        const { limit, skip } = pagination(req);

        const blogs = await Blog.find(filter)
            .select(select)
            .populate("category")
            .populate("subCategory")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const blogCount = await Blog.countDocuments(filter);

        return res.status(200).json({
            message: "Blogs fetched successfully",
            data: blogs,
            count: blogCount,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// BLOG - PUBLIC
// =====================================================

const getPublicBlogs = async (req, res) => {
    try {

        let filter = {
            published: true,
        };

        const select =
            "title shortTitle slug description thumbnail category user createdAt";

        // ==========================================
        // CATEGORY FILTER
        // ==========================================

        if (
            req.query.category &&
            req.query.category !== "all"
        ) {

            const categorySlug = decodeURIComponent(
                String(req.query.category)
            )
                .trim()
                .toLowerCase();

            console.log(
                "[PUBLIC BLOG] Category requested:",
                categorySlug
            );

            /*
             * Find category using case-insensitive slug.
             *
             * siteScopePlugin will automatically apply:
             * site = teachersbureau
             * when this request comes through
             * /s/teachersbureau/...
             */

            const category = await Category.findOne({
                slug: {
                    $regex: `^${categorySlug}$`,
                    $options: "i",
                },
            }).lean();

            console.log(
                "[PUBLIC BLOG] Category found:",
                category
                    ? {
                          id: category._id,
                          name: category.name,
                          slug: category.slug,
                      }
                    : null
            );

            /*
             * Important:
             * Do not return 404 for a missing category.
             * Return an empty blog result instead.
             *
             * This prevents the public website from breaking
             * when a category slug does not exist.
             */

            if (!category) {
                return res.status(200).json({
                    message: "No blogs found for this category",
                    data: [],
                    count: 0,
                });
            }

            filter.category = category._id;
        }

        // ==========================================
        // OPTIONAL FILTERS
        // ==========================================

        if (req.query.subCategory) {
            filter.subCategory = req.query.subCategory;
        }

        if (req.query.childCategory) {
            filter.childCategory = req.query.childCategory;
        }

        if (req.query.type) {
            filter.type = req.query.type;
        }

        // ==========================================
        // PAGINATION
        // ==========================================

        const { limit, skip } = pagination(req);

        // ==========================================
        // FETCH BLOGS
        // ==========================================

        const blogs = await Blog.find(filter)
            .select(select)
            .populate("category", "name slug")
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const count = await Blog.countDocuments(filter);

        console.log(
            "[PUBLIC BLOG] Site:",
            req.site || "unknown"
        );

        console.log(
            "[PUBLIC BLOG] Filter:",
            filter
        );

        console.log(
            "[PUBLIC BLOG] Blogs found:",
            blogs.length
        );

        return res.status(200).json({
            message: "Public blogs fetched successfully",
            data: blogs,
            count,
        });

    } catch (error) {

        console.error(
            "[PUBLIC BLOG] Error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =====================================================
// CASE STUDY CATEGORIES
// =====================================================

const getCategoriesCaseStudy = async (req, res) => {
    try {

        const categories = await Blog.aggregate([
            {
                $match: {
                    type: "case-studies",
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },

            {
                $unwind: "$category",
            },

            {
                $group: {
                    _id: "$category._id",
                    category: {
                        $first: "$category",
                    },
                },
            },

            {
                $replaceRoot: {
                    newRoot: "$category",
                },
            },
        ]);

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// PUBLIC CATEGORY LIST
// =====================================================

const getCategoriesListPublic = async (req, res) => {
    try {

        let filter = {};

        const { limit, skip } = pagination(req);

        const categories = await Category.find(filter)
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        const categoryCount =
            await Category.countDocuments(filter);

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
            count: categoryCount,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// SINGLE BLOG BY SLUG
// =====================================================

const getBlogBySlug = async (req, res) => {
    try {

        const { slug } = req.params;

        const blog = await Blog.findOne({
            slug,
        })
            .populate("category")
            .populate("subCategory")
            .populate("user", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            message: "Blog fetched successfully",
            data: blog,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: error.message,
            message: "Error in server",
        });
    }
};


// =====================================================
// SINGLE BLOG BY ID
// =====================================================

const getBlogById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Blog ID",
            });
        }

        const blogRaw = await Blog.findById(id);

        console.log(
            "Blog found:",
            blogRaw
        );

        const blog = await Blog.findById(id)
            .populate("category")
            .populate("subCategory")
            .populate("childCategory")
            .populate("user", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            message: "Blog fetched successfully",
            data: blog,
        });

    } catch (error) {

        console.error(
            "Error in getBlogById:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,

    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getSubCategories,

    createChildCategory,
    updateChildCategory,
    deleteChildCategory,
    getChildCategories,

    createBlog,
    updateBlog,
    getBlogBySlug,
    getBlogList,

    getCategoriesListPublic,
    getBlogById,
    getCategoriesCaseStudy,

    getPublicBlogs,
};

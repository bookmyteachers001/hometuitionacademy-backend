const mongoose = require('mongoose');
const siteScopePlugin = require('../helper/siteScopePlugin');

const blogSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type:{
        type: String
    },
    shortTitle:{
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    thumbnail: {
        _id: String,
        url: String,
        name: String,
        alt: String
    },
    keywords: [{
        type: String
    }],
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: true
    },
    publishAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    schema: {
        type: Object,
        required: true,
    }
});

blogSchema.plugin(siteScopePlugin);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
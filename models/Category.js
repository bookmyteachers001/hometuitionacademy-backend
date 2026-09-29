const mongoose = require('mongoose');
const siteScopePlugin = require('../helper/siteScopePlugin');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  slug: {
    type: String,
    required: true
  },

  image: {
    _id: String,
    url: String,
    name: String,
    alt: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Multi-site support
categorySchema.plugin(siteScopePlugin);

// slug unique per site
categorySchema.index(
  { site: 1, slug: 1 },
  { unique: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

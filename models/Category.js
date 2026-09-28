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
  slug:{
    type: String,
    required: true,
    unique: true
  },
  image: {
    _id:String,
    url:String,
    name:String,
    alt:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.plugin(siteScopePlugin);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
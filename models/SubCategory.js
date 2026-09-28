const mongoose = require('mongoose');
const siteScopePlugin = require('../helper/siteScopePlugin');

const subCategorySchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

subCategorySchema.plugin(siteScopePlugin);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
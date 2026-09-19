const mongoose = require('mongoose');

const childCategorySchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChildCategory = mongoose.model('ChildCategory', childCategorySchema);

module.exports = ChildCategory;
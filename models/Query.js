const mongoose = require('mongoose');
const siteScopePlugin = require('../helper/siteScopePlugin');

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  source: {
    type: String,
    enum: ['website', 'app', 'others']
  },
  createdAt: { type: Date, default: Date.now }
});

querySchema.plugin(siteScopePlugin);

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
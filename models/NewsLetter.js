const mongoose = require('mongoose');
const siteScopePlugin = require('../helper/siteScopePlugin');

const newsletterSchema = new mongoose.Schema({
  email: {
	type: String,
	required: true,
	unique: true,
	match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  subscribedAt: {
	type: Date,
	default: Date.now()
  },
  source:{
    type: String,
    enum: ['website','app','others']
  }
});

newsletterSchema.plugin(siteScopePlugin);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
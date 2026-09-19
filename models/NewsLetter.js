const mongoose = require('mongoose');

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

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
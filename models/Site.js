const mongoose = require('mongoose');

// A website that shares this backend/database/admin panel.
// NOT site-scoped — it is the list of sites itself.
const siteSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9][a-z0-9-]{1,39}$/,
  },
  name: { type: String, required: true, trim: true },
  domain: { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);

const mongoose = require("mongoose");
const siteScopePlugin = require('../helper/siteScopePlugin');

const SeoSchema = new mongoose.Schema({
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: [{ type: String, trim: true }],
  canonical: { type: String, trim: true },
  robots: { type: String, trim: true },
  favicon: { type: String, trim: true },
  ogTitle: { type: String, trim: true },
  ogDescription: { type: String, trim: true },
  ogImage: { type: String, trim: true },
  schema: { type: mongoose.Schema.Types.Mixed }, // flexible for JSON-LD schema
}, { _id: false }); // prevents creation of separate _id for sub-docs

const PageSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true, trim: true, index: true },
  type: { type: String, enum: ["static", "dynamic"], default: "static" },
  title: { type: String, trim: true },
  description: { type: String, trim: true },
  content: { type: String }, // can hold rich text or HTML
  heroImage: { type: String, trim: true },
  published: { type: Boolean, default: true },
  seo: SeoSchema,
}, { timestamps: true });

PageSchema.plugin(siteScopePlugin);

module.exports = mongoose.model("Page", PageSchema);

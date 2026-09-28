// Runs once on every boot (safe to repeat):
//  1. makes sure the default site exists in the Sites list
//  2. tags all pre-multi-site documents with the default site
//  3. rebuilds indexes so slug / url / email are unique PER SITE
const Site = require('../models/Site');
const { DEFAULT_SITE } = require('./siteContext');

const scopedModels = [
  'Blog', 'Service', 'Category', 'SubCategory', 'ChildCategory',
  'Query', 'NewsLetter', 'Page', 'Project',
].map((name) => require(`../models/${name}`));

async function migrateMultiSite() {
  const exists = await Site.findOne({ key: DEFAULT_SITE });
  if (!exists) {
    await Site.create({
      key: DEFAULT_SITE,
      name: process.env.DEFAULT_SITE_NAME || 'Home Tuition Academy',
    });
    console.log(`[multi-site] created default site "${DEFAULT_SITE}"`);
  }

  for (const Model of scopedModels) {
    const res = await Model.updateMany(
      { site: { $exists: false } },
      { $set: { site: DEFAULT_SITE } }
    );
    if (res.modifiedCount) {
      console.log(`[multi-site] ${Model.modelName}: tagged ${res.modifiedCount} old docs as "${DEFAULT_SITE}"`);
    }
    try {
      await Model.syncIndexes();
    } catch (err) {
      console.error(`[multi-site] ${Model.modelName}: index sync failed:`, err.message);
    }
  }
  console.log('[multi-site] ready');
}

module.exports = migrateMultiSite;

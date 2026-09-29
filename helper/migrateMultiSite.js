const Site = require('../models/Site');
const { DEFAULT_SITE } = require('./siteContext');

const scopedModels = [
  'Blog',
  'Service',
  'Category',
  'SubCategory',
  'ChildCategory',
  'Query',
  'NewsLetter',
  'Page',
  'Project',
].map((name) => require(`../models/${name}`));

async function migrateMultiSite() {
  // Make sure default site exists
  const exists = await Site.findOne({
    key: DEFAULT_SITE
  });

  if (!exists) {
    await Site.create({
      key: DEFAULT_SITE,
      name: process.env.DEFAULT_SITE_NAME || 'Home Tuition Academy',
    });

    console.log(
      `[multi-site] created default site "${DEFAULT_SITE}"`
    );
  }

  // Add default site to old documents
  for (const Model of scopedModels) {
    try {
      const res = await Model.updateMany(
        {
          $or: [
            { site: { $exists: false } },
            { site: null },
            { site: '' }
          ]
        },
        {
          $set: {
            site: DEFAULT_SITE
          }
        }
      );

      if (res.modifiedCount) {
        console.log(
          `[multi-site] ${Model.modelName}: tagged ${res.modifiedCount} old docs as "${DEFAULT_SITE}"`
        );
      }
    } catch (err) {
      console.error(
        `[multi-site] ${Model.modelName}: site migration failed:`,
        err.message
      );
    }
  }

  // Rebuild indexes
  for (const Model of scopedModels) {
    try {
      await Model.syncIndexes();

      console.log(
        `[multi-site] ${Model.modelName}: indexes synced`
      );
    } catch (err) {
      console.error(
        `[multi-site] ${Model.modelName}: index sync failed:`,
        err.message
      );
    }
  }

  console.log('[multi-site] ready');
}

module.exports = migrateMultiSite;

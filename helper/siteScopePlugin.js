const { getSite, DEFAULT_SITE } = require('./siteContext');

function siteScopePlugin(schema) {
  // Add site field to the schema
  schema.add({
    site: {
      type: String,
      default: DEFAULT_SITE,
      index: true,
    },
  });

  // Automatically add the current site to queries
  const addSiteToQuery = function (next) {
    const site = getSite() || DEFAULT_SITE;

    if (!this.getQuery().site) {
      this.where({ site });
    }

    next();
  };

  schema.pre('find', addSiteToQuery);
  schema.pre('findOne', addSiteToQuery);
  schema.pre('findOneAndUpdate', addSiteToQuery);
  schema.pre('countDocuments', addSiteToQuery);
  schema.pre('exists', addSiteToQuery);

  // Automatically set site when creating a document
  schema.pre('save', function (next) {
    if (!this.site) {
      this.site = getSite() || DEFAULT_SITE;
    }

    next();
  });
}

module.exports = siteScopePlugin;

const { getSite, DEFAULT_SITE } = require('./siteContext');

function siteScopePlugin(schema) {

  schema.add({
    site: {
      type: String,
      default: DEFAULT_SITE,
      index: true,
    },
  });

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

  schema.pre('save', function (next) {
    if (!this.site) {
      this.site = getSite() || DEFAULT_SITE;
    }

    next();
  });
}

module.exports = siteScopePlugin;

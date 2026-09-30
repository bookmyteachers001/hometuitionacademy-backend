// Mongoose plugin: adds a `site` field to a schema and automatically
// (a) stamps new documents with the current site, and
// (b) restricts every find / update / delete / count / aggregate to it.
// Unique fields (slug, url, email...) become unique PER SITE, so two
// websites can each have e.g. a blog called "how-to-study".
const { getSite, DEFAULT_SITE } = require('./siteContext');

function siteFilter(site) {
  // Old documents (created before multi-site) have no `site` field and
  // belong to the default site.
  if (site === DEFAULT_SITE) {
    return { $or: [{ site }, { site: { $exists: false } }] };
  }
  return { site };
}

module.exports = function siteScopePlugin(schema) {
  if (schema.path('site')) return;

  schema.add({ site: { type: String, default: DEFAULT_SITE, index: true } });

  // Make every field-level `unique: true` unique per site instead.
  Object.keys(schema.paths).forEach((name) => {
    if (name === '_id' || name === 'site') return;
    const p = schema.paths[name];
    if (p.options && p.options.unique) {
      // SchemaType#unique(false) is a no-op for plain `unique: true` fields,
      // so reset the internal index spec directly (keeps a NON-unique index).
      p.options.unique = false;
      p._index = {};
      schema.index({ site: 1, [name]: 1 }, { unique: true });
    }
  });

  schema.pre('validate', function (next) {
    const site = getSite();
    if (this.isNew && site) this.site = site;
    next();
  });

  schema.pre('insertMany', function (next, docs) {
    const site = getSite();
    if (site && Array.isArray(docs)) docs.forEach((d) => { d.site = site; });
    next();
  });

  const queryOps = [
    'find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete',
    'findOneAndReplace', 'updateOne', 'updateMany', 'replaceOne',
    'deleteOne', 'deleteMany', 'countDocuments',
  ];
  schema.pre(queryOps, function (next) {
    const site = getSite();
    if (site) this.and([siteFilter(site)]);
    next();
  });

  schema.pre('aggregate', function (next) {
    const site = getSite();
    if (site) this.pipeline().unshift({ $match: siteFilter(site) });
    next();
  });
};

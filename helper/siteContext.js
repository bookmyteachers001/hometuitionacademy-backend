// Multi-site support: one backend + one database serving many websites.
// The "current site" for a request is kept in AsyncLocalStorage so every
// Mongoose query made while handling that request is automatically scoped
// to that site — no controller needs to know about it.
const { AsyncLocalStorage } = require('async_hooks');

const als = new AsyncLocalStorage();

// Data created before multi-site support belongs to this site.
const DEFAULT_SITE = process.env.DEFAULT_SITE || 'hometuitionacademy';

function cleanKey(value) {
  const key = String(value || '').trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,39}$/.test(key) ? key : DEFAULT_SITE;
}

// Site key comes from (in priority order):
//   1. URL prefix  /s/<site>/api/...   (used by the websites)
//   2. x-site header                   (used by the admin dashboard)
//   3. ?site= query param
//   4. DEFAULT_SITE
function siteMiddleware(req, res, next) {
  const key = cleanKey(req.params.site || req.get('x-site') || req.query.site);
  req.site = key;
  als.run({ site: key }, next);
}

function getSite() {
  const store = als.getStore();
  return store ? store.site : null;
}

module.exports = { siteMiddleware, getSite, cleanKey, DEFAULT_SITE };

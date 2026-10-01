const Site = require('../models/Site');
const { DEFAULT_SITE } = require('../helper/siteContext');

async function listSites(req, res) {
  try {
    const sites = await Site.find().sort({ createdAt: 1 });
    return res.status(200).json({ message: 'Sites fetched successfully', data: sites });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, message: 'Error in server' });
  }
}

async function createSite(req, res) {
  try {
    const { key, name, domain } = req.body;
    const site = await new Site({ key, name, domain }).save();
    return res.status(200).json({ message: 'Site created successfully', data: site });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A site with this key already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Key must be 2-40 lowercase letters, numbers or hyphens, and name is required.' });
    }
    return res.status(500).json({ error: error.message, message: 'Error in server' });
  }
}

async function updateSite(req, res) {
  try {
    const { name, domain } = req.body;
    const site = await Site.findByIdAndUpdate(
      req.params.id,
      { name, domain },
      { new: true, runValidators: true }
    );
    if (!site) return res.status(404).json({ message: 'Site not found' });
    return res.status(200).json({ message: 'Site updated successfully', data: site });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, message: 'Error in server' });
  }
}

// Removes the website from the switcher only. Its blogs/services/leads/etc.
// are NOT deleted — they stay in the database tagged with that site's key,
// so nothing is lost if the website is re-added later with the same key.
async function deleteSite(req, res) {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });

    if (site.key === DEFAULT_SITE) {
      return res.status(400).json({ message: 'The default website cannot be deleted.' });
    }

    await Site.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Site deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, message: 'Error in server' });
  }
}

module.exports = { listSites, createSite, updateSite, deleteSite };

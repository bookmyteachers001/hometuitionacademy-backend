const Site = require('../models/Site');

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

module.exports = { listSites, createSite, updateSite };

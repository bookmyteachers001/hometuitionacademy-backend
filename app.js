const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/config');
const { siteMiddleware } = require('./helper/siteContext');
const migrateMultiSite = require('./helper/migrateMultiSite');
const app = express();

// Use cors middleware to enable CORS
app.use(cors()); 
app.use(bodyParser.json());


// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const blogRoutes = require('./routes/blog');
const mediaRoutes = require('./routes/media');

// All API routes live in one router so they can be mounted twice:
//   /api/...              -> site from x-site header (admin) or default site
//   /s/<site>/api/...     -> site from the URL (each website uses this)
const api = express.Router();
api.use('/api/auth', authRoutes);
api.use('/api/admin', adminRoutes); 
api.use('/api/public', publicRoutes);
api.use('/api/media', mediaRoutes);
api.use('/api', blogRoutes);

app.use('/s/:site', siteMiddleware, api);
app.use('/', siteMiddleware, api);

// MongoDB Connection
mongoose.connect(config.mongodb.dbConnectionString)
  .then(() => {
    console.log('MongoDB connected');
    return migrateMultiSite();
  })
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
    res.json({ message: 'Blog API is working fine v1.0'});
});
app.use('*', (req, res) => {
  res.status(404).json({ message: 'This route does not exist.' });
});


app.listen(config.server.port, () => {
    console.log("Server is running on http://localhost:"+config.server.port);
});

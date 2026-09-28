const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/config');
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

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/public', publicRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', blogRoutes);
// MongoDB Connection
mongoose.connect(config.mongodb.dbConnectionString)
  .then(() => console.log('MongoDB connected'))
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

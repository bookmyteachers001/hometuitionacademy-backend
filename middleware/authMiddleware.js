const jwt = require('jsonwebtoken');
const config = require('../config/config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // authHeader.split() used to be called even when authHeader was
    // undefined (no header sent at all), which threw an unhandled
    // TypeError and crashed the request as a raw 500 instead of a
    // clean 401 — this now checks first.
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    jwt.verify(token, config.jwt.jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Not authorized, invalid token' });

        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };

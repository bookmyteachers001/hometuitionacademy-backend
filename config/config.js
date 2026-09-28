require('dotenv').config();

module.exports = {
    jwt: {
        jwtSecret: process.env.JWT_SECRET,
        expiresIn: "10d"
    },
    pagination: {
        limit: 10,
        maxLimit: 100
    },
    server: {
        // Render (and most hosts) assign a port dynamically via PORT —
        // this was hardcoded to 80 before, which breaks on Render.
        port: process.env.PORT || 5000
    },
    mongodb: {
        dbConnectionString: process.env.MONGODB_CONNECTION_STRING
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        folder: "home-tuition-near-me"
    }
}

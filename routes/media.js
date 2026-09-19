
const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const ImageCloudinaryController = require("../core/ImageCloudinaryController");
const BaseController = require("../core/BaseController");
const config = require('../config/config');
const  {authenticateToken}  = require('../middleware/authMiddleware');
const  {authoriseAdmin}  = require('../middleware/authoriseUser');

// Switched from WordPress (which needed WORDPRESS_APP_PASSWORD for a
// third-party WordPress site we don't control) to Cloudinary — same
// controller interface, so nothing else here needed to change.
const mediaController = new ImageCloudinaryController(Image, {
   cloudinary: config.cloudinary,
   rootAccessRoles: ["admin"]
})

const publicImageController = new BaseController(Image, {
    access: 'admin',
    get: {
        pagination: config.pagination,
        pre:(filter,req,res)=>{
            if(!(req.user.role == 'admin' || req.user.role == 'editor')) {
                filter.createdBy = req.user._id;
                filter.public = true;
            }
        },
        sort: { createdAt: -1 }
    }
});

const privateImageController = new BaseController(Image, {
    access: 'user',
    accessKey: 'createdBy',
    get: {
        pagination: config.pagination,
        sort: { createdAt: -1 }
    }
});

// routes/media.js
// router.post('/', authenticateToken, mediaController.uploadImage);
// router.post('/bulk', authenticateToken, mediaController.uploadBulkImages);
// router.delete('/:id', authenticateToken, mediaController.deleteImage);

// router.get('/', authenticateToken, privateImageController.get);
// router.get('/public', authenticateToken, publicImageController.get);

// router.put('/:id', authenticateToken, publicImageController.updateById);



router.post('/', authenticateToken ,mediaController.uploadImage);
router.get('/', authenticateToken, privateImageController.get);
router.get('/public',authenticateToken, publicImageController.get);
router.delete('/:id', authenticateToken ,mediaController.deleteImage);

router.put('/:id', authenticateToken,mediaController.updateImageFile );


module.exports = router;
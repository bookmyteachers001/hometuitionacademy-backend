
const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { authoriseAdmin } = require('../middleware/authoriseUser');
const blogController = require('../controllers/blog');
const serviceController = require('../controllers/service');

router.get('/blog/:slug', blogController.getBlogBySlug);

router.use(authenticateToken);
router.use(authoriseAdmin);

router.get('/blog', blogController.getBlogList);
router.post('/blog', blogController.createBlog);
router.put('/blog/:id',  blogController.updateBlog);
router.get('/blog/:id', blogController.getBlogById);

router.get('/category',blogController.getCategories);
router.post('/category', blogController.createCategory);
router.put('/category/:id',  blogController.updateCategory);
router.delete('/category/:id',  blogController.deleteCategory);

router.get('/sub-category', blogController.getSubCategories);
router.post('/sub-category', blogController.createSubCategory);
router.put('/sub-category/:id', blogController.updateSubCategory);
router.delete('/sub-category/:id', blogController.deleteSubCategory);

router.get('/child-category', blogController.getChildCategories);
router.post('/child-category', blogController.createChildCategory);
router.put('/child-category/:id', blogController.updateChildCategory);
router.delete('/child-category/:id', blogController.deleteChildCategory);

router.post('/service', serviceController.createService);
router.put('/service/:id', serviceController.updateService);
router.get('/service', serviceController.getServices);
router.get('/service/:id', serviceController.getServicesById);

module.exports = router;

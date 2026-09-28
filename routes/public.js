const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public');
const blogController = require('../controllers/blog');
const serviceController = require('../controllers/service');

const  { pageController,projectController } = require('../controllers/page');

router.post('/query',publicController.createQuery);
router.post('/news-letter',publicController.createNewsletter);

router.get('/blog', blogController.getPublicBlogs);
router.get('/blog/:slug', blogController.getBlogBySlug);
router.get('/category',blogController.getCategoriesListPublic);
router.get('/case-study', blogController.getCategoriesCaseStudy);


router.get('/service/list', serviceController.getPublicServicesList);
router.get('/service/sitemap-data', serviceController.getServiceSitemapData);
router.get('/service/:pre/:service/:location/:post', serviceController.getPublicServicesBySlug);
router.get('/service/:pre/:service/:location', serviceController.getPublicServicesBySlug);
router.get('/service/:pre/:service', serviceController.getPublicServicesBySlug);
router.get('/service/:pre', serviceController.getPublicServicesBySlug);

router.get('/page', pageController.get);
router.get('/page/:id', pageController.getById);

router.get('/project', projectController.get);
router.get('/project/:id', projectController.getById);

module.exports = router;

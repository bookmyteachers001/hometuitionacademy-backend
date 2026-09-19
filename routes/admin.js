
const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { authoriseAdmin } = require('../middleware/authoriseUser');
const adminController = require('../controllers/admin');
const  { pageController , projectController } = require('../controllers/page');

router.use(authenticateToken);
router.use(authoriseAdmin);


router.get('/user',adminController.getAllUsers);
router.put('/user/:id',adminController.updateUser);
router.get('/dashboard',adminController.getDashboardStats);
router.get('/query',adminController.getQuery);
router.delete('/query/:id',adminController.removeQuery);
router.delete('/blog/:id',adminController.removeblog);
router.delete('/service/:id',adminController.removeService);
router.get("/newsletter",adminController.getNewsLetter);

// page route 

router.get('/page', pageController.get);
router.get('/page/:id', pageController.getById);
router.post('/page', pageController.create);
router.put('/page/:id', pageController.updateById);
router.delete('/page/:id', pageController.deleteById);




// project route

router.get('/project', projectController.get);
router.get('/project/:id', projectController.getById);
router.post('/project', projectController.create);
router.put('/project/:id', projectController.updateById);
router.delete('/project/:id', projectController.deleteById);

module.exports = router;

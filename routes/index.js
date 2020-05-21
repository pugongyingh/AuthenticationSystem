// this index.js is entry point to all the routes

const express = require('express');


//express.Router helps in seperating routers and controllers
const router = express.Router();

//to access controller
const homeController = require('../controllers/home_controller');


router.get('/', homeController.home);
router.use('/users', require('./users')); 
// router.use('/posts', require('./posts'));
// router.use('/comments', require('./comments'));
// router.use('/likes', require('./likes'));

// router.use('/api', require('./api'));



//it has to be exported to used in main index.js
module.exports = router;
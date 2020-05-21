const express = require('express');


//express.Router helps in seperating routers and controllers
const router = express.Router();

const passport = require('passport');

//to access controller
const usersController = require('../controllers/users_controller');

console.log('router profile loaded');


router.get('/profile/:id', passport.checkAuthentication,  usersController.profile);
// router.post('/update/:id', passport.checkAuthentication,  usersController.update);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}, 
), usersController.createSession);

router.get('/sign-out', usersController.destroySession);

// scope is the info which we are looking to fetch
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// this is url at which we receive the data
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


module.exports = router;
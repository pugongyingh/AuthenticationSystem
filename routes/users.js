const express = require('express');

//express.Router helps in seperating routers and controllers
const router = express.Router();

const passport = require('passport');

//to access controller
const usersController = require('../controllers/users_controller');


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);
router.get('/reset', usersController.reset);
router.get('/re-password/:accessToken/:isValid', usersController.resetPassword);
router.get('profile', usersController.profile);
router.post('/create-new-password', usersController.changePassword);
router.post('/create', usersController.create);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}, 
), usersController.createSession);

router.use('/reset-password', usersController.createPasswordResetReq);


module.exports = router;
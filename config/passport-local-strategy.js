const passport = require('passport');

//require the passport strategy
const LocalStrategy = require('passport-local').Strategy;

//import the user
const User = require('../models/user');

//we need to tell the passport to use the local strategy we created
//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    // for passing req data to res local for flash msg
    passReqToCallback: true
},
    //done is inbuilt in passport
    //done is callback func retuning to pjs
    function(req, email, password, done) {
    // find a user and establish the identity
    //first email is schema email
    //second is passed in the func above
    User.findOne({email: email}, function(err, user) {
        if (err) { 
            req.flash('error', err);
            console.log('error in finding the user --> Passport');
            //done can two args, first is err
            return done(err); 
        }
            if(!user || !user.validPassword(password)) {
                req.flash('error', 'Invalid Username/Password');
                // console.log('Invalid Username/Password');
                return done(null, false);
            }

            //if user found
            return done(null, user);
    });
    }
));

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    //sets the user id in the cookie
    //encrypts the cookie
    done(null, user.id);

})

//when browser make the req
//deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    //find the user if its exists in the db
    User.findById(id, function(err, user){
        if (err) { 
            console.log('error in finding the user --> Passport');
            
            return done(err); 
        }

        return done(null, user);
    });
     
});

//check if the user is authenticated
// use this as a middleware
passport.checkAuthentication = function(req,res,next) {
    // if the user is signed in, then pass on the req to the next func(controller's action)
      if(req.isAuthenticated()){
        return next();
      }

      // if the user is not signed in
      return res.redirect('./sign-in');
}

//  after the user is signed in
passport.setAuthenticatedUser = function(req,res,next) {
    if(req.isAuthenticated()){

//req.user contains the current signed in user from the session cookie & we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
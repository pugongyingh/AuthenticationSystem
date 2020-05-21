const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// for generating random passwords
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use new Strategy(google Strategy) for google login
passport.use(new googleStrategy({
    clientID: '1079302500111-fo0k868aadktppdsq2sel1uibflaip3s.apps.googleusercontent.com',
    clientSecret: 'FMBCmVezhEnWpCiwsbI1D-7R',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
},
 // just like jwt google also generates access token and gives it to us 
 // if access token expires, refresh helps get us another token  
    function(accessToken, refreshToken, profile, done) {
        //  find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user) {
            if(err) {console.log('error in google strategy-passport',err); return; }
            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user) {
                // if found, set this user as req.user
                return done(null, user);
            }else {
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')

                },function(err) {
                    if(err) {console.log('error in creating user google strategy-passport',err); return; }

                    return done(null, user);
                })
                
            }
        });
    }


));

module.exports = passport;



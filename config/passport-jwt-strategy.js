const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;

// module which helps extract the jwt from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;

// authentication on user
const User = require('../models/user');


// for encryption
// header is a list of keys, it has a key called authorization(it is also list of keys and have a key called bearer)
// bearer will be having the jwt token
let opts = {
    // find jwt from header using authheader, it will decrypted using codeial
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // this is encry/decrypt string
    secretOrKey: 'regiStarr'
}

// tell passport to use jwt strategy
// callback func which reads data from the jwt payload
// done is just a callback, we can use anyother name
// user is already present in the jwt we are just fetching out id from the payload and checking
// if user is there or not
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    // find the user based on the info from payload
    // store the complete user info in the payload info encrypted
    User.findById(jwtPayLoad._id, function(err, user) {
        if(err) {console.log('Error in finding the user from JWT'); return; }
        if(user) {
            // if user found error would be null
            return done(null,user);
        } else {
            // false if user not found
            return done(null,false);
        }
    })


}));

module.exports = passport;
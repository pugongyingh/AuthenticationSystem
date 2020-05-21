const User =  require('../models/user');

// reqd for deleting
// const fs = require('fs');
// const path = require('path');

// not using async coz no nesting level, only one callback
module.exports.profile = function(req,res) {
    User.findById(req.params.id, function(err,user) {
        return res.render('profile', {
            title: "Profile",
            profile_user: user
      });
       
    });
}




// render the sign up page
module.exports.signUp =  function(req,res) {
    if(req.isAuthenticated()) {
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Sign Up"
    });
}

// render the sign in page
module.exports.signIn =  function(req,res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Sign In"
    });
}

//get the sign up data
module.exports.create = function(req,res) {
    if(req.body.password!= req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({
        email : req.body.email
    }, function(err, user) {
        if(err) {
            console.log('error in finding user signing up');
            return;
        }
          if(!user) {
             User.create(req.body, function(err, user) {
                if(err) {
                    console.log('error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
             })
          }else  {
            return res.redirect('back');
          }
    })
    };


//sign in and create a seesion for the user
//after authenticating 
module.exports.createSession = function(req,res) {
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

// whenever signin happens flash message is sent into the session cookie
// whenever refresh happens flash msg is erased

module.exports.destroySession = function(req,res){
    // passport gives this to req
    req.logout()
    // this is in req, to pass it to res(ejs) we can use middlewares
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
} 


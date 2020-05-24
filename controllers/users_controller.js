const User =  require('../models/user');

const Reset = require('../models/resetpasswordtoken');
// const Activate= require('../models/activate');
const nodemailer=require('../config/nodemailer');
// const resetPasswordMailer = require('../mailers/reset_mailer');
// const queue = require('../config/kue');
// const passwordEmailWorker =  require('../workers/password_email_worker');
// const mailer = require('../config/nodemailer');
var crypto = require('crypto');

// reqd for deleting
// const fs = require('fs');
// const path = require('path');

// not using async coz no nesting level, only one callback
// module.exports.profile = function(req,res) {
//     User.findById(req.params.id, function(err,user) {
//         return res.render('profile', {
//             title: "Profile",
//             profile_user: user
//       });
       
//     });
// }


module.exports.home = function(req,res) {
  return res.render('home', {
    title: "Home"
  });
}

// render the sign up page
module.exports.signUp =  function(req,res) {
  if(req.isAuthenticated()) {
     return res.redirect('home');
  }
  return res.render('user_sign_up', {
      title: "Sign Up"
  });
}

// render the sign in page
module.exports.signIn =  function(req,res) {
  if(req.isAuthenticated()) {
      return res.render('home', {
        title: "home"
      });
  } 
  return res.render('user_sign_in', {
      title: "Sign In"
  });
}

//get the sign up data
module.exports.create = async function(req,res) {
  console.log('confirm_password');
  try {
    
    if(req.body.password!= req.body.confirm_password) {
     
       req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    let user = await User.findOne({ email : req.body.email})
       
    
    // , function(err, user) {
        if (user) {
          req.flash('error', 'User already exists');
          console.log("user already exists");
          return res.redirect('back');
        }
        else {
          //create a new user
          user = new User();
          user.email = req.body.email;
          user.name = req.body.name;
          //set password as encrypted hash
          user.setPassword(req.body.password);
          await user.save();
          user = await user.populate('user', 'name email').execPopulate();
          req.flash('success', 'Account Created');
          return res.redirect('/users/sign-in');
        }
      }
       catch (err) {
        req.flash('error', 'Internal system error');
        console.log(err);
        return res.redirect('back');
      }
    }


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

module.exports.reset = function(req,res) {
     res.render('user_reset', {
        title: "Forgot Password"
    });
}


 
module.exports.createPasswordResetReq = async function (req, res) {
  try {
    //if email id matches a user
    let user = await User.findOne({ user: req.body.user });
    console.log(user);
    if (user) {
      //create a new reset password token
      console.log('user');
      let resetpasswordtoken = await Reset.create({
        user: user._id,
        accessToken: crypto.randomBytes(35).toString('hex'),
       
        isValid: true
      });
      console.log(resetpasswordtoken.accessToken, );
      console.log(resetpasswordtoken.isValid);
      //populate the token and send it through mailer
      resetpasswordtoken = await resetpasswordtoken.populate('user', 'email name').execPopulate();

      var mailOptions = {
        to: user.email,
        subject: 'User Auth | Password Reset Email',
        text: 'Hi, \n\n You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:8000/users/re-password/' +  resetpasswordtoken.accessToken  + '/' + resetpasswordtoken.isValid +
        '\n\n' +  'If you did not request this, please ignore this email and your password will remain unchanged.\n\nThank You\nUser Auth Team.'
    };
    //send eamil for reset password.
    let mail=await nodemailer.transporter.sendMail(mailOptions);
    if(!mail){
        req.flash('error', 'Error Sending Mail!');
    }

      req.flash('success', 'Please check your email');
      return res.redirect('back');
    }
    else {
      console.log('Error in finding user to reset password');
      req.flash('error', 'Try again with a valid email address');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', 'Internal Server Error');
    console.log(`Error:  ${err}`);
    return res.redirect('back');
  }
}

// module.exports.changeLogin = function(req,res) {
//   let user = findOne(req.body.user);
// }


//validate reset password link and render reset password page
module.exports.resetPassword = function (req, res) {

//     //if token exists

    // let resetpasswordtoken = Reset.findOne({ accessToken: req.params.accessToken});
    let accessToken = req.params.accessToken;
    let isValid = req.params.isValid;
    // console.log("resetpasswordtoken.accessToken ", accessToken);
    // console.log("resetpasswordtoken.isValid ", resetpasswordtoken.isValid);
    // if (resetpasswordtoken) {
      
      // console.log(resetpasswordtoken.accessToken);
        return res.render('change_password', {
          
          title: "Reset password",
          accessToken: accessToken,
          isValid: isValid
          // resetpasswordtoken: resetpasswordtoken
        }
        );
      // }
}


//reset password -> forgot password
module.exports.changePassword = async function (req, res) {
  console.log('change');
  // let resetpasswordtoken = Reset.findOne({ accessToken: req.body.accessToken });
  // console.log(resetpasswordtoken);
  try {
    //if passwords dont match
    if (req.body.password != req.body.confirm_password) {
      console.log('no match');
      
      req.flash('error', 'passwords dont match');
      
      return res.redirect('back');
    }
    let resetpasswordtoken = await Reset.findOne({ accessToken: req.body.accessToken });
    console.log(req.body.accessToken);
    //if password token exists and is valid
    if (resetpasswordtoken && resetpasswordtoken.isValid) {
      let user = await User.findById(resetpasswordtoken.user);
      if (user) {
        //set new password
        user.setPassword(req.body.password);
        await user.save();
        console.log("password updated successfully")
        req.flash('success', 'Password updated successfully');
        return res.redirect('/users/sign-in');
      }
    }
  } catch (err) {
    req.flash('error', 'Internal Server Error');
    console.log(`Error:  ${err}`);
    return;
  }
}
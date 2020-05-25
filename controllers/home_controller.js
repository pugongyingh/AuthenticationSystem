const User = require('../models/user');

module.exports.home = function(req,res) {
  // to render an ejs file
    return res.render('user_sign_in', {
        title: 'RegiStarr'
       
  })};
  

    
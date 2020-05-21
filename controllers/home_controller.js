const User = require('../models/user');

module.exports.home = async function(req,res) {
  // to render an ejs file
    return res.render('home', {
        title: 'RegiStarr'
       
  })};
  

    
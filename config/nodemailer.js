const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


// transporter defines the configuaration using which we send emails
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    // 587(tls, which is the highest form of security)
    post: '587',
    secure: false,
     // authentication using which we send emails
    auth: {
        user: 'mounikagonae',
        pass: ''
    },
    tls: {
        rejectUnauthorized: false
    }
});

 // define we will be using ejs
 // relativePath from where the mail is being sent
 let renderTemplate = (data, relativePath) => {
     let mailHTML;
     ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err) {console.log('error in rendering template', err); return; }

            mailHTML = template;
        }
     )

       return mailHTML;
 }

  module.exports = {
      transporter: transporter,
      renderTemplate: renderTemplate
  }
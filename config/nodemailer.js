const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


// transporter defines the configuaration using which we send emails
module.exports.transporter = nodemailer.createTransport({
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

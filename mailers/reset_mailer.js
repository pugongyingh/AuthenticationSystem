const nodeMailer =  require('../config/nodemailer');

const page =  require('../views/reset_password.ejs');
// create a func which will send mail
// newComment = func{}
// module.exports = newc
// this is another way of exporting a method
exports.newPasswordReq = (resetpasswordtoken) => {
    console.log('Inside newPassword mailer');

 let htmlString = nodeMailer.renderTemplate({resetpasswordtoken: resetpasswordtoken}, '../views/reset_password.ejs');

    // send an email
    nodeMailer.transporter.sendMail({
        from: 'mounikagonae',
        // sending to the person who commented
        to: resetpasswordtoken.user.email,
        subject: 'Change Password',
        html: htmlString
    }, (err, info) => {
        // info carries the info'tn about the req that has been sent
        if(err) {console.log('error in sending mail', err);  return; }

        console.log('Message Sent', info);
        return;
    })
}
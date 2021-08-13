"use strict";
const nodemailer = require("nodemailer");
const constants = require('../config/constants');
const EmailTemplate = require('email-templates');

class Mail {
  async sendEmail(emailData) {

    let transporter = nodemailer.createTransport({
      host: constants.MAIL_HOST,
      port: constants.MAIL_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: constants.MAIL_USERNAME,
        pass: constants.MAIL_PASSWORD
      },
      tls: {
          rejectUnauthorized: false
      }
    });

    let template  = new EmailTemplate();
    template
    .render(emailData.path, emailData)
    .then(async html => {
      let mailOptions = {
        from: '"Cognizance VCT" <no_reply@cognizancevct.com>',
        to: emailData.email,
        subject: emailData.subject,
        text: 'This was another message.',
        html: html
      };
      await transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          console.log("MAIL ERROR: ", error);
        } else {
          console.log('MAIL RESPONSE: ', info)
        }
      })
    })
    .catch(console.error);
  }
}

const mail = new Mail();
module.exports = mail;

'use strict';
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: process.env.PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

exports.sendEmails = (emailPayload, pinToEmail, userDetails) => {
    for (let index = 0; index < pinToEmail.length; index++) {
        let payloadUser = {
            name: userDetails[pinToEmail[index]][1],
            unfollow: userDetails[pinToEmail[index]][3]
        }
        const toUSer = pinToEmail[index];
        const fromMailer  = process.env.FROM_USER;
        ejs.renderFile(__dirname + "/email-body.ejs", {emailPayload: emailPayload, payloadUser: payloadUser}, (err, data) => {
            if (err) {
                console.log(`EJS error: ${err}`);
            } else {
                const mainOptions = {
                    from: fromMailer,
                    to: toUSer,
                    subject: `New slots available near your location`,
                    html: data
                };
                transporter.sendMail(mainOptions, (err, info) => {
                    if (err) {
                        console.log(`Email Error: ${JSON.stringify(err, null, 2)}`);
                    } else {
                        console.log(`Email Sent sucessfully to ${pinToEmail[index]} with payload ${JSON.stringify(emailPayload, null, 2)}`)
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        
        });
    }
};
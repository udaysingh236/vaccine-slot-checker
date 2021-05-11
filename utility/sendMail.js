const nodemailer = require("nodemailer");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: process.env.PORT,
    secure: process.env.SECURE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: process.env.SECURE,
    }
});

exports.sendEmails = (sessionInfo, sessionData, pinToEmail, userDetails) => {
    for (let index = 0; index < pinToEmail.length; index++) {
        let payload = {
            name: userDetails[pinToEmail[index]][1],
            centerName: sessionData.name,
            address: sessionData.address,
            district_name: sessionData.district_name,
            state_name: sessionData.state_name,
            pincode: sessionData.pincode,
            date: sessionInfo.date,
            available_capacity: sessionInfo.available_capacity,
            unfollow: userDetails[pinToEmail[index]][3]
        }
        const toUSer = pinToEmail[index];
        const fromMailer  = process.env.MAIL_USER;
        ejs.renderFile(__dirname + "/email-body.ejs", {payload: payload}, (err, data) => {
            if (err) {
                console.log(`EJS error: ${err}`);
            } else {
                const mainOptions = {
                    from: fromMailer,
                    to: toUSer,
                    subject: `New slots available near your location`,
                    html: data
                };
                console.log(`Sending mail metadata: ${mainOptions}`);
                transporter.sendMail(mainOptions, (err, info) => {
                    if (err) {
                        console.log(`Email Error: ${err}`);
                    } else {
                        console.log(`Email Sent sucessfully to ${pinToEmail[index]} for Date ${sessionInfo.date} and pincode ${sessionData.pincode}`)
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        
        });
    }
};
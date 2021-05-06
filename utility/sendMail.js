const nodemailer = require("nodemailer");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: process.env.PORT,
    secure: process.env.SECURE,
    auth: {
        user: process.env.USER,
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
        ejs.renderFile(__dirname + "/email-body.ejs", {payload: payload}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let mainOptions = {
                    from: process.env.USER,
                    to: pinToEmail[index],
                    subject: `Slots available at ${sessionData.pincode} on ${sessionInfo.date}`,
                    html: data
                };
                transporter.sendMail(mainOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        
        });
    }
};
/* This file handles the connection to Nodemailer using the credentials in our .env file.
 * Nodemailer lets us send emails using Express and is used for the Contact Us page. */

const nodemailer = require("nodemailer");

/** The reusable transporter object for nodemailer. */
const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

// This verifies if nodemailer successfully logged into the host provided.
transporter.verify((err) => {
    if (err) console.log("An error occurred in nodemailer's configuration:", err);
    else console.log('Nodemailer is ready to receive messages.');
});

module.exports = transporter;
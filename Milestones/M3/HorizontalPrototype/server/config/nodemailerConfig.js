const nodemailer = require("nodemailer");

// Reusable transporter object for nodemailer. 
const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

/* This function verifies if nodemailer successfully logged into the host provided.
   The success/failure message will be printed to the console. */
transporter.verify((err) => {
    if (err) {
        console.log("An error occurred in nodemailer's configuration:", err);
    } else {
        console.log('Nodemailer is ready to take messages.');
    }
});

module.exports = transporter;
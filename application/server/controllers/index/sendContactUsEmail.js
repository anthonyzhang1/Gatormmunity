/* This file contains the controller that allows people to send emails to the developers via the Contact Us page. */

const transporter = require("../../config/nodemailerConfig");
const { ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");

/**
 * Sends an email to Gatormmunity's email containing the user's input in the contact us form.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS.
 */
const sendContactUsEmail = (req, res) => {
    const { senderName, senderEmail, messageSubject: providedEmailSubject, messageBody } = req.body;

    /** The actual subject of the email that will be sent. */
    let emailSubject = "";

    // use the email subject provided by the user if one was given, otherwise use a default one
    if (providedEmailSubject.length) emailSubject = "[Contact Us] " + providedEmailSubject;
    else emailSubject = `[Contact Us] Message from ${senderName}`;

    /** The configuration for the email being sent. The html portion is the actual body of the message. */
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: process.env.NODEMAILER_USER,
        subject: emailSubject,
        html: `
			<h3>Sender's Information</h3>
			<p>Name: ${senderName}</p>
			<p>Email: ${senderEmail}</p>
			<h3>Message:</h3>
			<p>${messageBody}</p>`
    };

    /* Proceed to send the mail and let the front end know whether the email sending was successful or not. */
    transporter.sendMail(mailOptions, (err) => {
        if (err) { // error
            console.log("Nodemailer failed to send an email:", err);
            res.json({ status: ERROR_STATUS });
        } else { // success
            res.json({ status: SUCCESS_STATUS });
        }
    });
};

module.exports = sendContactUsEmail;
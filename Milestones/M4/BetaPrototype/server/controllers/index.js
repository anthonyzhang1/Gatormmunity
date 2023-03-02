const transporter = require("../config/nodemailerConfig");

exports.contactUs = (req, res) => {
    const senderName = req.body.senderName;
    const senderEmail = req.body.senderEmail;
    const messageBody = req.body.messageBody;

    let emailSubject = ""; // use the email subject provided by the user, or use a default one if none is given
    if (req.body.messageSubject.length > 0) emailSubject = "[Contact Us] " + req.body.messageSubject;
    else emailSubject = `[Contact Us] Message from ${senderName}`;

    /** This is the configuration for the email being sent.
      * The html is the actual body of the message that will be displayed. */
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: process.env.NODEMAILER_USER,
        subject: emailSubject,
        html: `
			<h3>Sender's Information</h3>
			<p>Name: ${senderName}</p>
			<p>Email: ${senderEmail}</p>
			<h3>Message:</h3>
			<p>${messageBody}</p>
			`,
    };

    transporter.sendMail(mailOptions, (err) => {
        // tell the front end whether the email successfully sent or not
        if (err) {
            console.log("Nodemailer failed to send an email:", err);
            res.json({ status: "error" });
        } else {
            res.json({ status: "success" });
        }
    });
};
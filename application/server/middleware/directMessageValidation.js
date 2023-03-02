/* This file contains the input validation code for the controllers related to direct messages. */

const yup = require("yup");
const { ERROR_STATUS } = require("../helpers/Constants");

/**
 * Validates the create direct message form.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.createDirectMessageValidator = async (req, res, next) => {
    try {
        await createDirectMessageFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your direct message.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the create direct message form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const createDirectMessageFormValidation = yup.object({
    body: yup
        .string()
        .min(1, "Your message cannot be empty.")
        .max(5000, "Your message must be from 1-5'000 characters long."),

    conversationId: yup
        .number()
        .integer("The conversation ID must be an integer.")
        .positive("The conversation ID must be positive.")
        .required("You must provide a conversation ID."),

    senderId: yup
        .number()
        .integer("The sender ID must be an integer.")
        .positive("The sender ID must be positive.")
        .required("You must provide a sender ID.")
});
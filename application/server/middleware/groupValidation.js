/* This file contains the input validation code for the controllers related to groups. */

const yup = require("yup");
const fs = require("fs");
const { ERROR_STATUS } = require("../helpers/Constants");
const CustomError = require("../helpers/CustomError");
const { imageValidation } = require("./imageValidation");

/**
 * Validates the change announcement form.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.changeAnnouncementValidator = async (req, res, next) => {
    try {
        await changeAnnouncementFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your announcement.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the update announcement form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const changeAnnouncementFormValidation = yup.object({
    announcement: yup
        .string()
        .max(5000, "The announcement must be at most 5'000 characters long."),

    groupId: yup
        .number()
        .integer("The group ID must be an integer.")
        .positive("The group ID must be positive.")
        .required("You must provide a group ID."),

    userId: yup
        .number()
        .integer("Your user ID must be an integer.")
        .positive("Your user ID must be positive.")
        .required("You must provide your user ID.")
});

/**
 * Validates the create chat message form.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.createChatMessageValidator = async (req, res, next) => {
    try {
        await createChatMessageFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your chat message.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the create chat message form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const createChatMessageFormValidation = yup.object({
    body: yup
        .string()
        .min(1, "Your message cannot be empty.")
        .max(5000, "Your message must be from 1-5'000 characters long."),

    groupId: yup
        .number()
        .integer("The group ID must be an integer.")
        .required("You must provide a group ID."),

    senderId: yup
        .number()
        .integer("The sender ID must be an integer.")
        .positive("The sender ID must be positive.")
        .required("You must provide a sender ID.")
});

/** 
 * Validates the create group form. Deletes the uploaded file on failed validation.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.createGroupValidator = async (req, res, next) => {
    try {
        await createGroupFormValidation.validate(req.body); // validate the form

        if (!req.file) throw new CustomError("You must upload a picture for your group.");
        else imageValidation(req.file);

        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server encountered an error whilst validating your group creation form.";
            console.log(err);
        }

        // delete the uploaded file on failure
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the create group form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const createGroupFormValidation = yup.object({
    groupName: yup
        .string()
        .min(1, "Your group's name must be from 1-255 characters long.")
        .max(255, "Your group's name must be from 1-255 characters long."),

    groupDescription: yup
        .string()
        .max(5000, "Your group's description must be at most 5'000 characters long."),

    adminId: yup
        .number()
        .integer("Your user ID must be an integer.")
        .positive("Your user ID must be positive.")
        .required("You must provide a user ID.")
});
/* This file contains the input validation code for the controllers related to users. */

const yup = require("yup");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");
const { imageValidation } = require("./imageValidation");
const { MODERATOR_ROLE, USER_ROLES, ERROR_STATUS } = require("../helpers/Constants");

/** 
 * Validates the change password form.
 *
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.changePasswordValidator = async (req, res, next) => {
    try {
        await changePasswordFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or use a generic one
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your change password form.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the change password form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const changePasswordFormValidation = yup.object({
    newPlaintextPassword: yup
        .string()
        .min(1, "The new password must be from 1-64 characters long.")
        .max(64, "The new password must be from 1-64 characters long.")
});

/** Checks if the current user is a moderator or above before advancing to the next function.
  * Sends nothing if the user is not a moderator or above. */
exports.moderatorValidation = (req, res, next) => {
    if (req.session?.userData?.role >= MODERATOR_ROLE) next();
    else res.end();
}

/**
 * Validates the profile picture provided when the user tries to change their profile picture.
 *
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.profilePictureValidator = async (req, res, next) => {
    try {
        if (!req.file) throw new CustomError("You must upload a profile picture.");
        else imageValidation(req.file); // validate the image

        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or use a generic one
        if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server failed to change your picture due to a validation error.";
            console.log(err);
        }

        // delete the uploaded file on failed registration
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** 
 * Validates the registration form.
 *
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.registrationValidator = async (req, res, next) => {
    try {
        await registrationFormValidation.validate(req.body); // validate the form

        if (!req.file) throw new CustomError("You must upload an SFSU ID picture.");
        else imageValidation(req.file); // validate the image

        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or use a generic one
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server encountered an error whilst validating your registration form.";
            console.log(err);
        }

        // delete the uploaded file on failed validation
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the registration form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const registrationFormValidation = yup.object({
    fullName: yup
        .string()
        .min(1, "Your full name must be from 1-100 characters long.")
        .max(100, "Your full name must be from 1-100 characters long.")
        .test( // the user's full name requires a space, i.e. their full name must contain a first name and a last name
            "full-name-has-last-name",
            "Your full name must include a last name separated by a space.",
            fullName => fullName.includes(" ")
        )
        .required("Your full name must be from 1-100 characters long."),

    email: yup
        .string()
        .email("Your email must be in the form xxx@...sfsu.edu.")
        .min(1, "Your email must be from 1-255 characters long.")
        .max(255, "Your email must be from 1-255 characters long.")
        .test( // check that the email ends with "sfsu.edu"
            "check-sfsu-email",
            "Your email must be an SFSU email.",
            email => email.endsWith("sfsu.edu")
        )
        .required("Your email must be from 1-255 characters long."),

    sfsuIdNumber: yup
        .number()
        .integer("Your SFSU ID number must be an integer.")
        .positive("Your SFSU ID number must be a positive number.")
        .test( // SFSU ID numbers are 9 digits long
            "sfsu-id-number-length",
            "Your SFSU ID number must be exactly 9 digits long, and cannot start with 0.",
            sfsuIdNumber => sfsuIdNumber.toString().length === 9
        )
        .required("You must provide an SFSU ID number."),

    password: yup
        .string()
        .min(6, "Your password must be from 6-64 characters long.")
        .max(64, "Your password must be from 6-64 characters long.")
        .required("Your password must be from 6-64 characters long.")
});

/** 
 * Validates the search form.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.searchValidator = async (req, res, next) => {
    try {
        await searchFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or use a generic one
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your search form.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the search form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const searchFormValidation = yup.object({
    role: yup
        .string()
        .nullable()
        .test( // the role provided must be one of those in the dropdown
            "is-valid-role",
            "Your role filter must be one of those in the dropdown.",
            role => role ? USER_ROLES.find(validRole => validRole.value === parseInt(role)) : true // role can be null
        )
});
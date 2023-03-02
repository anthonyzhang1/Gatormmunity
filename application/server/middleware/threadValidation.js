/* This file contains the input validation code for the controllers related to forum threads. */

const yup = require("yup");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");
const { imageValidation } = require("./imageValidation");
const { THREAD_CATEGORIES, ERROR_STATUS } = require("../helpers/Constants");

/** 
 * Validates the create thread form.
 *
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.createThreadValidator = async (req, res, next) => {
    try {
        await createThreadFormValidation.validate(req.body); // validate the form
        if (req.file) imageValidation(req.file); // validate the file, if one was provided

        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or show a generic error message
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server encountered an error whilst validating your thread creation form.";
            console.log(err);
        }

        // delete the uploaded file on failure
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the create thread form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const createThreadFormValidation = yup.object({
    threadTitle: yup
        .string()
        .min(1, "Your thread title must be from 1-255 characters long.")
        .max(255, "Your thread title must be from 1-255 characters long."),

    threadBody: yup
        .string()
        .min(1, "Your thread body must be from 1-10'000 characters long.")
        .max(10000, "Your thread body must be from 1-10'000 characters long."),

    category: yup
        .string()
        .test( // the category provided must be one of those in the dropdown
            "check-valid-category",
            "Your thread category must be one of those in the dropdown.",
            category => THREAD_CATEGORIES.includes(category)
        )
        .required("You must specify a category for your thread."),

    creatorId: yup
        .number()
        .integer("Your user ID must be an integer.")
        .positive("Your user ID must be positive.")
        .required("You must provide a user ID.")
});

/** 
 * Validates the make post form.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
exports.makePostValidator = async (req, res, next) => {
    try {
        await makePostFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: ERROR_STATUS };

        // get the error message from the function which threw the error, or show a generic one
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.message = "The server encountered an error whilst validating your make post form.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the make post form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const makePostFormValidation = yup.object({
    body: yup
        .string()
        .min(1, "Your post body must be from 1-10'000 characters long.")
        .max(10000, "Your post body must be from 1-10'000 characters long."),

    threadId: yup
        .number()
        .integer("The thread ID must be an integer.")
        .positive("The thread ID must be positive.")
        .required("The thread ID is required."),

    authorId: yup
        .number()
        .integer("Your user ID must be an integer.")
        .positive("Your user ID must be positive.")
        .required("You must provide a user ID.")
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

        // get the error message from the function which threw the error, or show a generic one
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
    category: yup
        .string()
        .nullable()
        .test( // the category provided must be one of those in the dropdown
            "is-valid-category",
            "Your thread filter category must be one of those in the dropdown.",
            category => category ? THREAD_CATEGORIES.includes(category) : true // category can be null
        )
});
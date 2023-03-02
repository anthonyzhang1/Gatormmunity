const yup = require("yup");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");
const { imageValidation } = require("./imageValidation");
const { USER_ROLES } = require("../helpers/Constants");

/** Validates the registration input using a mix of yup and regular JavaScript.
  * If the form is valid, nothing will happen. If it is invalid, send an error status and message to the front end. */
exports.registrationValidator = async (req, res, next) => {
    try {
        await registrationFormValidation.validate(req.body); // validate the form

        if (!req.file) throw new CustomError("You must upload an SFSU ID picture.");
        else imageValidation(req);

        next();
    } catch (err) {
        let returnData = { status: "error" }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        // if the error is not one we accounted for, show a generic error message
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

        // delete uploaded files on failed registration
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the registration form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const registrationFormValidation = yup.object({
    full_name: yup // validation for the full name
        .string()
        .min(1, "Your full name must be from 1-100 characters long.")
        .max(100, "Your full name must be from 1-100 characters long.")
        .test(
            "full-name-has-last-name", // name of the test
            "Your full name must include a last name separated by a space.", // error message
            full_name => full_name.includes(" ") // validation code
        )
        .required("Your full name must be from 1-100 characters long."),

    email: yup // validation for the email
        .string()
        .email("Your email must be in the form xxx@...sfsu.edu.")
        .min(1, "Your email must be from 1-255 characters long.")
        .max(255, "Your email must be from 1-255 characters long.")
        .test(
            "check-sfsu-email",
            "Your email must be an SFSU email.",
            email => email.endsWith("sfsu.edu")
        )
        .required("Your email must be from 1-255 characters long."),

    sfsu_id_number: yup // validation for the SFSU ID number
        .number()
        .integer("Your SFSU ID number must be an integer.")
        .positive("Your SFSU ID number must be a positive number.")
        .test(
            "sfsu-id-number-length", // name of the test
            "Your SFSU ID number must be exactly 9 digits long.", // error message
            sfsu_id_number => sfsu_id_number.toString().length === 9 // validation code
        )
        .required("You must provide an SFSU ID number."),

    password: yup // validation for the password
        .string()
        .min(6, "Your password must be from 6-64 characters long.")
        .max(64, "Your password must be from 6-64 characters long.")
        .required("Your password must be from 6-64 characters long."),
});

/** Validates the profile picture input using regular JavaScript.
  * If the image is valid, nothing will happen. If it is invalid, send an error status and message to the front end. */
exports.profilePictureValidator = async (req, res, next) => {
    try {
        if (!req.file) throw new CustomError("You must upload a profile picture.");
        else imageValidation(req);

        next();
    } catch (err) {
        let returnData = { status: "error" }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error
        // if the error is not one we accounted for, show a generic error message
        if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server failed to change your picture due to a validation error.";
            console.log(err);
        }

        // delete uploaded files on failed registration
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** Validates the search form.
  * If the form is valid, nothing will happen. If it is invalid, send an error status and message to the front end. */
 exports.searchValidator = async (req, res, next) => {
    try {
        await searchFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = { status: "error" }; // holds the data that will be sent to the front end

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
    role: yup
        .string()
        .nullable()
        .test( // the role provided must be one of those in the dropdown
            "is-valid-role",
            "Your role filter must be one of those in the dropdown.",
            role => role ? USER_ROLES.find(validRole => validRole.value === parseInt(role)) : true // role can be null
        )
});
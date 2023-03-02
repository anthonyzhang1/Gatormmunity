const yup = require("yup");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");
const { imageValidation } = require("./imageValidation");
const { LISTING_CATEGORIES, VALID_CURRENCY_REGEX } = require("../helpers/Constants");

/** Validates the create listing form.
  * If the form is valid, nothing will happen. If it is invalid, send an error status and message to the front end. */
exports.createListingValidator = async (req, res, next) => {
    try {
        await createListingFormValidation.validate(req.body); // validate the form

        if (!req.file) throw new CustomError("You must upload a photo of your item.");
        else imageValidation(req);

        next();
    } catch (err) {
        let returnData = { status: "error" }; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or show a generic one
        if (err instanceof yup.ValidationError) {
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else if (err instanceof CustomError) {
            returnData.message = err.message;
            console.log(err);
        } else {
            returnData.message = "The server encountered an error whilst validating your create listing form.";
            console.log(err);
        }

        // delete the uploaded file on failure
        if (req.file) fs.unlink(req.file.path, () => { });

        res.json(returnData); // send the error status and message to the front end
    }
};

/** The yup schema for validating the create listing form.
  * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message. */
const createListingFormValidation = yup.object({
    listingTitle: yup
        .string()
        .min(1, "Your listing title must be from 1-255 characters long.")
        .max(255, "Your listing title must be from 1-255 characters long."),

    listingDescription: yup
        .string()
        .min(1, "Your listing description must be from 1-2500 characters long.")
        .max(2500, "Your listing description must be from 1-2500 characters long."),

    price: yup
        .string()
        .min(1, "Your price must be from $0.00 to $99,999.99.")
        .max(8, "Your price must be from $0.00 to $99,999.99.") // max 8 characters including the period
        .test(
            "is-non-negative-and-in-currency-format",
            "You must enter a valid price that is non-negative, e.g. 20.22.",
            price => VALID_CURRENCY_REGEX.test(price)
        ),

    category: yup
        .string()
        .test( // the category provided must be one of those in the dropdown
            "check-valid-category",
            "Your listing category must be one of those in the dropdown.",
            category => LISTING_CATEGORIES.includes(category)
        )
        .required("You must specify a category for your listing."),

    sellerId: yup
        .number()
        .integer("Your user ID must be an integer.")
        .positive("Your user ID must be positive.")
        .required("You must provide a user ID.")
});

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
    category: yup
        .string()
        .nullable()
        .test( // the category provided must be one of those in the dropdown
            "is-valid-category",
            "Your listing filter category must be one of those in the dropdown.",
            category => category ? LISTING_CATEGORIES.includes(category) : true // category can be null
        ),

    maxPrice: yup
        .string()
        .nullable()
        .test(
            "in-currency-format",
            "You must enter a non-negative price with at most 2 decimal places, e.g. 9.99.",
            maxPrice => maxPrice ? VALID_CURRENCY_REGEX.test(maxPrice) : true // price can be null
        )
});

/** Validates the get listings form.
  * If the form is valid, nothing will happen. If it is invalid, send an error status and message to the front end. */
exports.getListingsValidator = async (req, res, next) => {
    try {
        await searchFormValidation.validate(req.body); // validate the form
        next();
    } catch (err) {
        let returnData = {}; // holds the data that will be sent to the front end

        // get the error message from the function which threw the error, or show a generic one
        if (err instanceof yup.ValidationError) {
            returnData.status = "info"; // don't destroy the page because of a simple validation error
            returnData.message = err.errors;
            console.log(err.errors); // only show the relevant error message
        } else {
            returnData.status = "error";
            returnData.message = "The server encountered an error whilst validating your filters.";
            console.log(err);
        }

        res.json(returnData); // send the error status and message to the front end
    }
};
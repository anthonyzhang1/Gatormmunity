const yup = require("yup");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");

// only files of these types can be uploaded
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE = 5242880; // 5 MB in bytes. only files within the max fize size can be uploaded

/**
 * Validates the registration input using a mix of yup and regular JavaScript.
 * If the form is valid, nothing will happen. If it is invalid, send an error status and message to the front end.
 */
const registrationValidator = async (req, res, next) => {
	try {
		await registrationFormValidation.validate(req.body); // validate the form
		registrationFileValidaton(req); // validate the files

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
		if (req.files['sfsu_id_picture']) fs.unlink(req.files['sfsu_id_picture'][0].path, () => {});
		if (req.files['profile_picture']) fs.unlink(req.files['profile_picture'][0].path, () => {});

		res.json(returnData); // send the error status and message to the front end
	}
};

/**
 * The yup schema for validating the registration form.
 * If the form is valid, nothing will happen. If it is invalid, a `yup.ValidationError` will be thrown with an error message.
 */
const registrationFormValidation = yup.object({
	first_name: yup // validation for the first name
		.string()
		.min(1, "Your first name must be from 1-100 characters long.")
		.max(100, "Your first name must be from 1-100 characters long.")
		.required("Your first name must be from 1-100 characters long."),

	last_name: yup // validation for the last name
		.string()
		.min(1, "Your last name must be from 1-100 characters long.")
		.max(100, "Your last name must be from 1-100 characters long.")
		.required("Your last name must be from 1-100 characters long."),

	email: yup // validation for the email
		.string()
		.email("Your email must be in the format xxx@xxx.xxx.")
		.min(3, "Your email must be from 3-255 characters long.")
		.max(255, "Your email must be from 3-255 characters long.")
		.required("Your email must be from 3-255 characters long."),

	sfsu_id_number: yup // validation for the SFSU ID number
		.number()
		.integer("Your SFSU ID number must be an integer.")
		.positive("Your SFSU ID number must be a positive number.")
		.test(
			"sfsu-id-number-length", // name of the test
			"Your SFSU ID number must be from 1-16 characters long.", // error message
			sfsu_id_number => sfsu_id_number.toString().length >= 1 && sfsu_id_number.toString().length <= 16 // validation code
		)
		.required("Your SFSU ID number must be from 1-16 characters long."),

	password: yup // validation for the password
		.string()
		.min(6, "Your password must be from 6-64 characters long.")
		.max(64, "Your password must be from 6-64 characters long.")
		.required("Your password must be from 6-64 characters long."),

	confirm_password: yup // validation for the confirm password
		.string()
		.oneOf([yup.ref("password"), null], "Your password and confirm password must match.")
		.required("You must enter a confirm password."),

	role: yup // validation for the role
		.number()
		.typeError("Your role must be a number.")
		.required("You must select a role.")
});

/**
 * Validates the files that were uploaded in the registration form.
 * If the form is valid, nothing will happen. If it is invalid, a `CustomError` will be thrown with an error message.
 */
const registrationFileValidaton = (req) => {
	// ensure that the sfsu id picture file exists before accessing it
	if (!req.files['sfsu_id_picture']) {
		throw new CustomError("You must upload an SFSU ID picture.");
	} else {
		const sfsuIdPictureFile = req.files['sfsu_id_picture'][0];

		// validation for the sfsu id picture: check if the file is of a valid type and within the max file size
		if (!ACCEPTED_FILE_TYPES.includes(sfsuIdPictureFile.mimetype)) {
			throw new CustomError("Your SFSU ID picture must be a JPEG, PNG, WebP, GIF, or AVIF image file.");
		} else if (sfsuIdPictureFile.size > MAX_FILE_SIZE) {
			throw new CustomError("Your SFSU ID picture cannot exceed 5 MB.");
		}
	}

	// validation for the optional profile picture: 
	if (req.files['profile_picture']) {
		const profilePictureFile = req.files['profile_picture'][0];

		// check if the file is of a valid type and within the max file size
		if (!ACCEPTED_FILE_TYPES.includes(profilePictureFile.mimetype)) {
			throw new CustomError("Your profile picture must be a JPEG, PNG, WebP, GIF, or AVIF image file.");
		} else if (profilePictureFile.size > MAX_FILE_SIZE) {
			throw new CustomError("Your profile picture cannot exceed 5 MB.");
		}
	}
}

module.exports = { registrationValidator };
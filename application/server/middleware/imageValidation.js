/* This file contains the input validation code for images.
 * All images share the same requirements in terms of file type and size. */

const { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } = require("../helpers/Constants");
const CustomError = require("../helpers/CustomError");

/** 
 * Validates that the image is of the correct type and within the maximum file size limit.
 * If it is invalid, a `CustomError` will be thrown with an error message.
 * 
 * @param {File} imageFile The image file object itself, usually gotten by `req.file`.
 */
exports.imageValidation = (imageFile) => {
    if (!ACCEPTED_FILE_TYPES.includes(imageFile.mimetype)) { // invalid file type
        throw new CustomError("Your image must be a JPEG, PNG, WebP, GIF, or AVIF image file.");
    } else if (imageFile.size > MAX_FILE_SIZE) { // file size too large
        throw new CustomError("Your image cannot exceed 5 MB.");
    }
};
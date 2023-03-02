const CustomError = require("../helpers/CustomError");
const { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } = require("../helpers/Constants");

/** Validates that the image uploaded is of the correct type and within the maximum file size limit.
  * If the image is valid, nothing will happen. If it is invalid, a `CustomError` will be thrown with an error message. */
exports.imageValidation = (req) => {
    if (!ACCEPTED_FILE_TYPES.includes(req.file.mimetype)) {
        throw new CustomError("Your image must be a JPEG, PNG, WebP, GIF, or AVIF image file.");
    } else if (req.file.size > MAX_FILE_SIZE) {
        throw new CustomError("Your image cannot exceed 5 MB.");
    }
};
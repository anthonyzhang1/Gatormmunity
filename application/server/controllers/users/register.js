/* This file contains the controller that creates accounts when users register. */

const fs = require("fs");
const {
    ERROR, SUCCESS_STATUS, ERROR_STATUS, DEFAULT_PHOTO_THUMBNAIL_PATH, DEFAULT_PHOTO_PATH
} = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const AccountModel = require("../../models/AccountModel");
const UserModel = require("../../models/UserModel");

/** This gets the first and last name from a full name in the form [firstName, lastName].
  * Any extra whitespace in the full name is removed by this function. */
const getFirstLastName = (fullName) => {
    const nameArray = fullName.trim().split(/\s+/);

    // the first name is the first word in the full name, while the last name is the rest of the name
    return [nameArray[0], nameArray.slice(1).join(" ")];
};

/**
 * Attempt to create the user's account in the database.
 * The user's SFSU ID picture is saved in the file system on successful registration.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const register = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { fullName, email, sfsuIdNumber, password: plaintextPassword } = req.body;
    const sfsuIdPicturePath = req.file.path;

    UserModel.emailExists(email) // check if the provided email is already in use
        .then((emailExists) => {
            if (emailExists) throw new CustomError(`The email ${email} is already in use.`);

            return UserModel.sfsuIdNumberExists(sfsuIdNumber); // check if the provided SFSU ID number is already in use
        })
        .then((sfsuIdNumberExists) => {
            if (sfsuIdNumberExists) throw new CustomError(`The SFSU ID number ${sfsuIdNumber} is already in use.`);

            // get the first and last name from the full name
            const [firstName, lastName] = getFirstLastName(fullName);

            // create the user before creating the account
            return UserModel.createUser(firstName, lastName, email, sfsuIdNumber, sfsuIdPicturePath,
                DEFAULT_PHOTO_PATH, DEFAULT_PHOTO_THUMBNAIL_PATH);
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with createUser().");

            return AccountModel.createAccount(plaintextPassword, userId);
        })
        .then((accountId) => {
            if (accountId === ERROR) throw new Error("Error with createAccount().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData); // let the front end know of the successful account creation
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your registration failed due to a server error.";

            // delete uploaded files on failed registration
            fs.unlink(sfsuIdPicturePath, () => { });

            console.log(err);
            res.json(returnData); // let the front end know of the error
        });
};

module.exports = register;
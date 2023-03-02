/* This file contains the controller that logs the user in and creates their session data. */

const { ERROR, APPROVED_USER_ROLE, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const AccountModel = require("../../models/AccountModel");

/**
 * Attempt to log the user in by checking the entered credentials versus the credentials in the database.
 * The user will have a session created for them if the login was successful.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const login = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { sfsuIdNumber, password: plaintextPassword } = req.body;

    // check if the provided SFSU ID number and password are correct
    AccountModel.authenticateUser(sfsuIdNumber, plaintextPassword)
        .then((userData) => {
            if (userData === ERROR) { // if the login credentials were invalid
                throw new CustomError("Incorrect SFSU ID number and/or password.");
            } else if (userData.role < APPROVED_USER_ROLE) { // if user is unapproved
                throw new CustomError("Your account is still awaiting approval. Please try logging in again later.");
            } else if (userData.banned_by_id) { // if the user is banned
                throw new CustomError("Sorry, but your account has been banned. " +
                    "If you believe this ban has been made in error, please contact us.");
            }

            // sets the user's session data
            req.session.userData = {
                isLoggedIn: true,
                user_id: userData.user_id,
                first_name: userData.first_name,
                profile_picture_thumbnail_path: userData.profile_picture_thumbnail_path,
                role: userData.role
            };

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // if the error is not one we acccounted for, so we do not show the user an error message they won't understand
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your login failed due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end that the login failed
        });
};

module.exports = login;
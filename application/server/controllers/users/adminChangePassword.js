/* This file contains the controller that allows admins to change other users' passwords.
 * This cannot change an administrator's password, though. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS, ADMINISTRATOR_ROLE } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const AccountModel = require("../../models/AccountModel");
const UserModel = require("../../models/UserModel");

/**
 * Changes a user's password, as long as the target user is not an administrator. Only administrators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const adminChangePassword = (req, res) => {
    const { targetUserId, adminUserId, newPlaintextPassword } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel.getRole(adminUserId) // first, check that the supposed admin is actually an admin
        .then((role) => {
            if (role === ERROR) throw new Error("Error with getRole().");
            else if (role < ADMINISTRATOR_ROLE) throw new CustomError("Only administrators can change users' passwords.");

            return UserModel.getRole(targetUserId); // check that the target user is not an admin
        })
        .then((role) => {
            if (role === ERROR) throw new CustomError("The provided user ID does not belong to any user.");
            else if (role >= ADMINISTRATOR_ROLE) throw new CustomError("You cannot change an administrator's password.");

            return AccountModel.changePassword(newPlaintextPassword, targetUserId); // change the target user's password
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with changePassword().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `Successfully changed the password of the user with ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred whilst changing the user's password.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = adminChangePassword;
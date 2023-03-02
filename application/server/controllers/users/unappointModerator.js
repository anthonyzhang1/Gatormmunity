/* This file contains the controller that allows administrators to demote moderators to approved users. */

const {
    ERROR, ADMINISTRATOR_ROLE, MODERATOR_ROLE, SUCCESS_STATUS, ERROR_STATUS, APPROVED_USER_ROLE
} = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const UserModel = require("../../models/UserModel");

/**
 * Demotes a moderator to an approved user. Only administrators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const unappointModerator = (req, res) => {
    const { targetUserId, adminUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel.getRole(adminUserId) // check that the demoter is actually an admin
        .then((role) => {
            if (role === ERROR) throw new Error("Error with getUserProfileData().");
            else if (role !== ADMINISTRATOR_ROLE) throw new CustomError("Only administrators can unappoint moderators.");

            return UserModel.getRole(targetUserId); // check that the target is a moderator
        })
        .then((targetRole) => {
            if (targetRole === ERROR) {
                throw new CustomError("The provided user ID does not belong to any user.");
            } else if (targetRole !== MODERATOR_ROLE) {
                throw new CustomError("The provided user ID does not belong to a moderator.");
            }

            return UserModel.setRole(targetUserId, APPROVED_USER_ROLE); // we can now demote safely
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with setRole().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `Successfully unappointed the moderator with user ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred unappointing the moderator.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = unappointModerator;
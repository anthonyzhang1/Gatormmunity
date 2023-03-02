/* This file contains the controller that allows administrators to promote approved users to moderators. */

const {
    ERROR, APPROVED_USER_ROLE, MODERATOR_ROLE, ADMINISTRATOR_ROLE, SUCCESS_STATUS, ERROR_STATUS
} = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const UserModel = require("../../models/UserModel");

/**
 * Promotes an approved user to a moderator. Only administrators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const appointModerator = (req, res) => {
    const { targetUserId, adminUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel.getUserProfileData(adminUserId) // first, check that the promoter is actually an admin
        .then((profileData) => {
            if (profileData === ERROR) {
                throw new Error("Error with getUserProfileData().");
            } else if (profileData.role !== ADMINISTRATOR_ROLE) {
                throw new CustomError("Only administrators can appoint moderators.");
            }

            return UserModel.getUserProfileData(targetUserId); // check that the target is an approved user
        })
        .then((profileData) => {
            if (profileData === ERROR) {
                throw new CustomError("The provided user ID does not belong to any user.");
            } else if (profileData.role !== APPROVED_USER_ROLE) {
                throw new CustomError("The provided user ID does not belong to an approved user.");
            }

            return UserModel.setRole(targetUserId, MODERATOR_ROLE); // we can now promote safely
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with setRole().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `Successfully appointed the moderator with user ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred appointing the moderator.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = appointModerator;
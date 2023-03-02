/* This file contains the controller that bans unapproved or approved users. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS, MODERATOR_ROLE } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const UserModel = require("../../models/UserModel");

/**
 * Bans an unapproved or approved user. Only moderators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const banUser = (req, res) => {
    const { targetUserId, moderatorUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel.getRole(moderatorUserId) // first, check that the banner has moderation powers
        .then((role) => {
            if (role === ERROR) throw new Error("Error with getRole().");
            else if (role < MODERATOR_ROLE) throw new CustomError("Only moderators or administrators can ban users.");

            return UserModel.getRole(targetUserId); // check that the target is an unapproved or approved user
        })
        .then((role) => {
            if (role === ERROR) throw new CustomError("The provided user ID does not belong to any user.");
            else if (role >= MODERATOR_ROLE) throw new CustomError("You can only ban unapproved or approved users.");

            return UserModel.banUser(moderatorUserId, targetUserId); // we can now ban safely
        })
        .then((bannedUsersCount) => {
            if (bannedUsersCount === ERROR) throw new Error("Error with banUser().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `Successfully banned the user with ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred whilst banning the user.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = banUser;
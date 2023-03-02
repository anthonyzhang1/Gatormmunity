/* This file contains the controller that gets all of the group chats a user is in. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");
const UserModel = require("../../models/UserModel");

/**
 * Gets the group chats for a user.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groupChats: {Array} Contains objects containing group chats and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getGroupChats = (req, res) => {
    let returnData = {}; // will be returned to the front end
    const { userId } = req.params;

    UserModel.userExists(userId) // ensure that the user exists before fetching their chat groups
        .then((userExists) => {
            if (!userExists) throw new CustomError(`There is no user with the id '${userId}'.`);

            return GroupModel.getGroupChats(userId);
        })
        .then((groupChats) => {
            if (groupChats === ERROR) throw new Error("Error with getChatGroups().");

            returnData.status = SUCCESS_STATUS;
            returnData.groupChats = groupChats;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get your group chats due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getGroupChats;
/* This file contains the controller that gets the chat messages in a group chat. */

const { ERROR_STATUS, SUCCESS_STATUS, GATOR_CHAT_ID, ERROR } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Gets the group chat messages in a group chat.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * messages: {Array} Contains objects containing chat messages and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getChatMessages = (req, res) => {
    /** The maximum number of chat messages to retrieve. */
    const MAX_MESSAGES_RETRIEVED = 100;
    let returnData = {};

    const { userId, groupId: groupIdString } = req.params;
    let groupId = parseInt(groupIdString);

    if (groupId === GATOR_CHAT_ID) groupId = null; // Gator Chat is not a group, hence it has no group id

    GroupModel.getRole(userId, groupId) // ensure the user is a member of the group before getting the group chat messages
        .then((groupRole) => {
            if (groupRole === ERROR) throw new CustomError("You are not a member of this group.");

            return GroupModel.getNChatMessages(groupId, MAX_MESSAGES_RETRIEVED);
        })
        .then((chatMessages) => {
            if (!chatMessages) throw new Error("Error with getNChatMessages().");

            returnData.status = SUCCESS_STATUS;
            returnData.messages = chatMessages;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get the group's messages due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getChatMessages;
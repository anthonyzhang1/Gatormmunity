/* This file contains the controller that creates a chat message. */

const { ERROR, ERROR_STATUS, GATOR_CHAT_ID, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Inserts a chat message into the database.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createChatMessage = (req, res) => {
    const { body, groupId: groupIdString, senderId } = req.body;
    let groupId = parseInt(groupIdString);

    if (groupId === GATOR_CHAT_ID) groupId = null; // Gator Chat is not a group, therefore it has no group id

    GroupModel.getRole(senderId, groupId) // ensure the user is a member of the group before creating the message
        .then((groupRole) => {
            if (groupRole === ERROR) throw new CustomError("You are not a member of this group.");

            return GroupModel.createChatMessage(body, groupId, senderId);
        })
        .then((chatMessageId) => {
            if (chatMessageId === ERROR) throw new Error("Error with createChatMessage().");

            res.json({ status: SUCCESS_STATUS }); // tell the front end of the success
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your message was unable to be sent due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = createChatMessage;
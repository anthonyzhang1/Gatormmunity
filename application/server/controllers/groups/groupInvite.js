/* This file contains the controller that sends a group invite to another user via a direct message. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const DirectMessageModel = require("../../models/DirectMessageModel");
const GroupModel = require("../../models/GroupModel");
const UserModel = require("../../models/UserModel");

/**
 * Sends a group invite to another user via a direct message.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const groupInvite = (req, res) => {
    let group = {}; // used to save the data for the join code
    const { groupId, senderId, recipientId } = req.body;

    UserModel.getRole(recipientId) // ensure that the recipient exists
        .then((recipientRole) => {
            if (recipientRole === ERROR) throw new CustomError(`There is no user with the id '${recipientId}'.`);

            return GroupModel.getGroupName(groupId); // get the group's name used for the invite message
        })
        .then((groupName) => {
            if (groupName === ERROR) throw new CustomError(`There is no group with the id '${groupId}'.`);

            group.name = groupName;
            return GroupModel.getJoinCode(groupId); // get the join code for the group
        })
        .then((joinCode) => {
            if (joinCode === ERROR) throw new Error('Error with getJoinCode().');

            group.joinCode = joinCode;
            // check if a conversation exists between the sender and recipient before sending a direct message
            return DirectMessageModel.getConversationId(senderId, recipientId);
        })
        .then((conversationId) => {
            // If a conversation doesn't exist yet, create one.
            if (conversationId === ERROR) return DirectMessageModel.createConversation(senderId, recipientId);
            else return conversationId;
        })
        .then((conversationId) => {
            if (conversationId === ERROR) throw new Error('Error with createConversation().');

            /** The message that will be sent to the recipient. */
            const messageBody = `I am inviting you to our group "${group.name}"! Here is the invitation link:\n`
                + `http://54.241.101.69/join-group/${groupId}/${group.joinCode}`;

            return DirectMessageModel.createDirectMessage(messageBody, senderId, conversationId); // send the direct message
        })
        .then((directMessageId) => {
            if (directMessageId === ERROR) throw new Error('Error with createMessage().');

            res.json({ status: SUCCESS_STATUS }); // tell the front end of the successful invite
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "A server error occurred whilst sending your invite.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = groupInvite;
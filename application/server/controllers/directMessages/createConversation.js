/* This file contains the controller that creates conversations between two users. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const DirectMessageModel = require("../../models/DirectMessageModel");

/**
 * Creates a conversation between two users, if it does not exist already.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * conversationId: {int} The conversation id between the two users.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createConversation = (req, res) => {
    let returnData = {}; // data to be sent to the front end
    const { userId1, userId2 } = req.body;

    // if a conversation between the two already exists, get the conversation id
    DirectMessageModel.getConversationId(userId1, userId2)
        .then((conversationId) => {
            // if the conversation does not exist, create one.
            if (conversationId === ERROR) return DirectMessageModel.createConversation(userId1, userId2);
            else return conversationId;
        })
        .then((conversationId) => {
            if (conversationId === ERROR) throw new Error('Error with createConversation().');

            returnData.status = SUCCESS_STATUS;
            returnData.conversationId = conversationId; // the newly created or existing conversation id
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "A server error occurred whilst creating the conversation.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = createConversation;
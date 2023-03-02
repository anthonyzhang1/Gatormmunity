/* This file contains the controller that gets the direct messages in a conversation. */

const { ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const DirectMessageModel = require("../../models/DirectMessageModel");

/**
 * Gets the most recent direct messages in a conversation. The limit is specified in the controller.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * messages: {Array} Contains objects containing direct messages and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getDirectMessages = (req, res) => {
    /** The maximum number of direct messages to retrieve. */
    const MAX_MESSAGES_RETRIEVED = 100;
    let returnData = {};
    const { conversationId } = req.params;

    // get the most recent direct messages in a conversation
    DirectMessageModel.getNDirectMessages(conversationId, MAX_MESSAGES_RETRIEVED)
        .then((directMessages) => {
            if (!directMessages) throw new Error("Error with getNDirectMessages().");

            returnData.status = SUCCESS_STATUS;
            returnData.messages = directMessages;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "We were unable to get your messages due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getDirectMessages;
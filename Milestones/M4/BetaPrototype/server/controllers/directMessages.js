const { ERROR_STATUS, SUCCESS_STATUS } = require("../helpers/Constants");
const CustomError = require("../helpers/CustomError");
const DirectMessageModel = require("../models/DirectMessageModel");
const UserModel = require("../models/UserModel");

/** Gets a user's active conversations. */
exports.getConversations = (req, res) => {
    let returnData = {}; // saves the data sent to the front end
    const { userId } = req.params;

    UserModel
        .userExists(userId) // check that the user exists first, just in case
        .then((userExists) => {
            if (!userExists) throw new CustomError(`There is no user with the id '${userId}'.`);

            return DirectMessageModel.getConversations(userId); // get the conversations the user is in
        })
        .then((conversationData) => {
            if (conversationData === -1) throw new Error("Error with getConversations().");

            returnData.status = SUCCESS_STATUS;
            returnData.conversations = conversationData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get your conversations due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

/** Gets the direct messages from a conversation. */
exports.getNDirectMessages = (req, res) => {
    /** The maximum number of direct messages to retrieve from the database. */
    const MAX_MESSAGES_RETRIEVED = 100;
    let returnData = {};
    const { conversationId } = req.params;

    DirectMessageModel
        .getNDirectMessages(conversationId, MAX_MESSAGES_RETRIEVED)
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

/** Inserts a direct message into the database. */
exports.createDirectMessage = (req, res) => {
    const { body, conversationId, senderId } = req.body;

    DirectMessageModel
        .createDirectMessage(body, senderId, conversationId)
        .then((directMessageId) => {
            if (directMessageId === -1) throw new Error("Error with createDirectMessage().");

            res.json({ status: SUCCESS_STATUS }); // tell the front end the operation was successful
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS }; // stores the data sent to the front end
            returnData.message = "Your message was unable to be sent due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

/** Creates a conversation, if it does not exist. Returns the conversationId and success status on success. */
exports.createConversation = (req, res) => {
    let returnData = {}; // data to be sent to the front end
    const { userId1, userId2 } = req.body;

    DirectMessageModel
        .getConversationId(userId1, userId2) // if a conversation between the two already exist, get the conversation id
        .then((conversationId) => {
            // if a conversation id does not exist between the two users, create one. In either case, return the conversation id.
            if (conversationId === -1) return DirectMessageModel.createConversation(userId1, userId2);
            else return conversationId;
        })
        .then((conversationId) => {
            if (conversationId === -1) throw new Error('Error with createConversation().');

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
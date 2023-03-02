/* This file contains all of the database queries related to the direct_message and conversation tables. */

const database = require("../config/dbConfig");
const { ERROR } = require("../helpers/Constants");
const DirectMessageModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Creates a conversation between two users.
 * 
 * @param {int} userId1 The id of the user who is part of the conversation pair.
 * @param {int} userId2 The id of the other user who is part of the conversation pair.
 * @returns On successful insertion, returns the new conversation's id. Otherwise, returns ERROR.
 */
DirectMessageModel.createConversation = (userId1, userId2) => {
    // Ensures that smaller_user_id is the smaller of `userId1` and `userId2`.
    const [smallerUserId, largerUserId] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const insertSQL = `INSERT INTO conversation (smaller_user_id, larger_user_id)
                       VALUES (?, ?);`;

    return database.query(insertSQL, [smallerUserId, largerUserId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a direct message into the database.
 * 
 * @param {string} body The contents of the direct message.
 * @param {int} senderId The sender's user id.
 * @param {int} conversationId The id of the conversation that the message will belong to.
 * @returns On success, the id of the newly created direct message. Otherwise, ERROR.
 */
DirectMessageModel.createDirectMessage = (body, senderId, conversationId) => {
    const insertSQL = `INSERT INTO direct_message (body, sender_id, conversation_id)
                       VALUES (?, ?, ?);`;

    return database.query(insertSQL, [body, senderId, conversationId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the conversation id for the pair (userId1, userId2).
 * 
 * @param {int} userId1 The id of the user who can be either the sender or the recipient.
 * @param {int} userId2 The id of the user who can be either the sender or the recipient.
 * @returns If a conversation exists between the two users, returns the conversation id. Otherwise, returns ERROR.
 */
DirectMessageModel.getConversationId = (userId1, userId2) => {
    // Ensures that smaller_user_id is the smaller of `userId1` and `userId2`.
    const [smallerUserId, largerUserId] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const selectSQL = `SELECT conversation_id
                       FROM conversation
                       WHERE smaller_user_id = ? AND larger_user_id = ?;`;

    return database.query(selectSQL, [smallerUserId, largerUserId])
        .then(([results]) => {
            if (results.length) return results[0].conversation_id;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the conversation data for a user. The conversation data includes the conversation id, and the OTHER user's name and
 * picture. The conversations will be sorted such that the conversations with the most recent messages are at the beginning
 * of the array. Conversations with no messages use their creation date as the date of their most recent message instead.
 * 
 * @param {int} userId The id of the user to get the conversation data for.
 * @returns On successful query, returns an array of conversations with data about the other user in the conversation.
 *     There will be no data returned for the user with `userId`, i.e. you cannot have a conversation with yourself.
 *     The returned array can be empty. On unsuccessful query, returns ERROR.
 */
DirectMessageModel.getConversations = (userId) => {
    /** Gets the conversation and the other user's data for the conversations a user is in. We use LEFT OUTER JOIN
      * to get the direct messages of a user's conversations, then we use COALESCE to get a conversation's
      * most recent message if it exists, or the conversation's creation date if there are no messages in the conversation.
      * We then sort the conversations using the date returned by COALESCE. */
    const selectSQL = `SELECT c.conversation_id, u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS name,
                              u.profile_picture_thumbnail_path
                       FROM user u
                       INNER JOIN conversation c ON (u.user_id = c.smaller_user_id OR u.user_id = c.larger_user_id)
                       LEFT OUTER JOIN direct_message dm ON c.conversation_id = dm.conversation_id
                       WHERE (c.smaller_user_id = ? OR c.larger_user_id = ?)
                             AND u.user_id <> ?
                       GROUP BY c.conversation_id
                       ORDER BY COALESCE(MAX(dm.creation_date), c.creation_date) DESC;`;

    return database.query(selectSQL, [userId, userId, userId])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the N most recent direct messages for the specified conversation. The messages are sorted from oldest to newest.
 * 
 * @param {int} conversationId The id of the conversation to get the direct messages of.
 * @param {int} numMessages N, the maximum number of messages to get.
 * @returns An array with the data of each message. The array can be empty.
 */
DirectMessageModel.getNDirectMessages = (conversationId, numMessages) => {
    // need to select from a subquery in order to retrieve the last N messages from oldest to newest
    const selectSQL = `SELECT *
                       FROM (SELECT dm.direct_message_id, dm.sender_id, dm.body, dm.creation_date,
                                    CONCAT_WS(' ', u.first_name, u.last_name) AS sender_name
                             FROM direct_message dm
                             INNER JOIN user u ON u.user_id = dm.sender_id
                             WHERE dm.conversation_id = ?
                             ORDER BY dm.direct_message_id DESC
                             LIMIT ?) AS temp
                       ORDER BY temp.direct_message_id ASC;`;

    return database.query(selectSQL, [conversationId, numMessages])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

module.exports = DirectMessageModel;
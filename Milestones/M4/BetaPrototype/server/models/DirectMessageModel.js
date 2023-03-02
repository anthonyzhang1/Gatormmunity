const database = require("../config/dbConfig");
const DirectMessageModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Gets the conversation data for a user. The conversation data includes the conversation id,
 * and the OTHER user's name and picture. The conversations will be sorted by the other user's name,
 * in ascending alphabetical order.
 * 
 * @param {int} userId The id of the user to get the conversation data for.
 * @returns An array of conversations with data about the other user in the conversation.
 *     There will be no data returned for the user with `userId`. The array can be empty. If the array is null, returns -1.
 */
DirectMessageModel.getConversations = (userId) => {
    /** Gets the conversation and the other user's data for the conversations a user is in. */
    const selectSQL = `SELECT c.conversation_id, u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS name,
                              u.profile_picture_thumbnail_path
                       FROM user u
                       INNER JOIN conversation c ON (u.user_id = c.smaller_user_id OR u.user_id = c.larger_user_id)
                       WHERE (c.smaller_user_id = ? OR c.larger_user_id = ?)
                             AND u.user_id <> ?
                       ORDER BY name ASC;`;

    return database
        .query(selectSQL, [userId, userId, userId])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch(err => Promise.reject(err));
};

/**
 * Gets the N most recent direct messages for the specified conversation. The messages are sorted from oldest to newest.
 * 
 * @param {int} conversationId The id of the conversation to search for direct messages.
 * @param {int} numMessages N, the maximum number of messages to get.
 * @returns An array with the data of each message. Can be an empty array.
 */
DirectMessageModel.getNDirectMessages = (conversationId, numMessages) => {
    // need to select from a subquery in order to retrieve the last N messages from oldest to newest
    let selectSQL = `SELECT *
                     FROM (SELECT dm.direct_message_id, dm.sender_id, dm.body, dm.creation_date,
                                  CONCAT_WS(' ', sender.first_name, sender.last_name) AS sender_name
                           FROM direct_message dm
                           INNER JOIN user sender ON sender.user_id = dm.sender_id
                           WHERE dm.conversation_id = ?
                           ORDER BY dm.direct_message_id DESC
                           LIMIT ?) AS temp
                     ORDER BY temp.direct_message_id ASC;`;

    return database
        .query(selectSQL, [conversationId, numMessages])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a direct message into the database.
 * 
 * @param {string} body The contents of the direct message.
 * @param {int} sender_id The sender's user id.
 * @param {int} conversation_id The id of the conversation that the message will belong to.
 * @returns On success, the id of the newly created direct message. Otherwise, -1.
 */
DirectMessageModel.createDirectMessage = (body, sender_id, conversation_id) => {
    const insertSQL = `INSERT INTO direct_message (body, sender_id, conversation_id)
                       VALUES (?, ?, ?);`;

    return database
        .query(insertSQL, [body, sender_id, conversation_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the conversation id for the pair (userId1, userId2).
 * 
 * @param {int} userId1 The id of the user who can be either the sender or recipient.
 * @param {int} userId2 The id of the user who can be either the sender or recipient.
 * @returns If a conversation exists between the two users, returns the conversation id. If it does not, returns -1.
 */
DirectMessageModel.getConversationId = (userId1, userId2) => {
    // Ensures that smaller_user_id is the smaller of `userId1` and `userId2`.
    const [smaller_user_id, larger_user_id] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const selectSQL = `SELECT conversation_id 
                       FROM conversation
                       WHERE smaller_user_id = ? AND larger_user_id = ?`;

    return database
        .query(selectSQL, [smaller_user_id, larger_user_id])
        .then(([results]) => {
            if (results.length) return results[0].conversation_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Creates a conversation between the two users provided in the parameters.
 * 
 * @param {int} userId1 The id of the user who is starting a conversation with the user with id `userId2`.
 * @param {int} userId2 The id of the user who is starting a conversation with the user with id `userId1`.
 * @returns On successful insertion, returns the new conversation's id, otherwise -1.
 */
DirectMessageModel.createConversation = (userId1, userId2) => {
    // Ensures that smaller_user_id is the smaller of `userId1` and `userId2`.
    const [smaller_user_id, larger_user_id] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const insertSQL = `INSERT INTO conversation (smaller_user_id, larger_user_id)
                       VALUES (?, ?);`;

    return database
        .query(insertSQL, [smaller_user_id, larger_user_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Creates a direct message in the conversation with the given conversation id, sent from the sender with the given user id.
 * 
 * @param {string} messageBody The body of the message being sent.
 * @param {int} sender_id The user id of the message sender.
 * @param {int} conversation_id The conversation id of the conversation the message is being sent into.
 * @returns On successful insert, returns the direct message id. Otherwise, -1.
 */
DirectMessageModel.createMessage = (messageBody, sender_id, conversation_id) => {
    const insertSQL = `INSERT INTO direct_message (body, sender_id, conversation_id)
                       VALUES (?, ?, ?);`;

    return database
        .query(insertSQL, [messageBody, sender_id, conversation_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = DirectMessageModel;
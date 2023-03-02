/* This file contains all of the database queries related to the group, group_user, and chat_message tables. */

const database = require("../config/dbConfig");
const { ERROR, GROUP_MEMBER_ROLE, GROUP_ADMINISTRATOR_ROLE } = require("../helpers/Constants");
const GroupModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Adds a user to a group with the given role.
 *
 * @param {int} groupId The id of the group the user is being added to.
 * @param {int} userId The id of the user being added to the group.
 * @param {int} role The role of the user in the group.
 * @returns On successful insertion, `userId`. Otherwise, ERROR.
 */
GroupModel.addGroupUser = (groupId, userId, role) => {
    const insertUserSQL = `INSERT INTO group_user (group_id, user_id, role)
                           VALUES (?, ?, ?)`;

    return database.query(insertUserSQL, [groupId, userId, role])
        .then(([results]) => {
            if (results.affectedRows) return userId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Updates a group's announcement.
 *
 * @param {int} groupId The id of the group whose announcement is being changed.
 * @param {string} announcement The new announcement. It can be empty.
 * @returns The number of affected rows, or ERROR on error.
 */
GroupModel.changeAnnouncement = (groupId, announcement) => {
    const updateSQL = `UPDATE \`group\`
                       SET announcement = ?
                       WHERE group_id = ?;`;

    return database.query(updateSQL, [announcement, groupId])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a chat message into the database. If groupId is null, then the message is a Gator Chat message.
 * 
 * @param {string} body The contents of the chat message.
 * @param {int} groupId The id of the group to create the message in. Can be null,
 *     which indicates the message belongs to Gator Chat.
 * @param {int} senderId The sender's user id.
 * @returns On successful insertion, the newly created chat message's id. Otherwise, ERROR.
 */
GroupModel.createChatMessage = (body, groupId, senderId) => {
    const insertSQL = `INSERT INTO chat_message (body, group_id, sender_id)
                       VALUES (?, ?, ?);`;

    return database.query(insertSQL, [body, groupId, senderId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a new group into the database with the provided arguments.
 *
 * @param {string} name The group's name.
 * @param {string} description The group's description. Can be null.
 * @param {string} picturePath The path to the group's picture.
 * @param {string} pictureThumbnailPath The path to the group picture's thumbnail.
 * @returns On successful insertion, the new group's id. Otherwise, ERROR.
 */
GroupModel.createGroup = (name, description, picturePath, pictureThumbnailPath) => {
    const insertSQL = `INSERT INTO \`group\` (name, description, picture_path, picture_thumbnail_path)
                       VALUES (?, ?, ?, ?);`;

    return database.query(insertSQL, [name, description, picturePath, pictureThumbnailPath])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes a group from the database.
 * 
 * @param {int} groupId The id of the group to delete.
 * @returns On successful deletion, `groupId`. Otherwise, ERROR.
 */
GroupModel.deleteGroup = (groupId) => {
    const deleteSQL = `DELETE FROM \`group\`
                       WHERE group_id = ?;`;

    return database.query(deleteSQL, [groupId])
        .then(([results]) => {
            if (results.affectedRows) return groupId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes a group user from a group.
 * 
 * @param {int} groupId The id of the group to delete the user from.
 * @param {int} userId The id of the user to be deleted from the group.
 * @returns On successful deletion, groupId. Otherwise, ERROR.
 */
GroupModel.deleteGroupUser = (groupId, userId) => {
    const deleteSQL = `DELETE FROM group_user
                       WHERE group_id = ? AND user_id = ?;`;

    return database.query(deleteSQL, [groupId, userId])
        .then(([results]) => {
            if (results.affectedRows) return groupId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user id of the group's admin.
 *
 * @param {int} groupId The id of the group we are getting the admin's id of.
 * @returns If the admin was found, the admin's user id. Otherwise, ERROR.
 */
GroupModel.getGroupAdminId = (groupId) => {
    const selectSQL = `SELECT user_id
                       FROM group_user
                       WHERE group_id = ? AND role = ?;`;

    return database.query(selectSQL, [groupId, GROUP_ADMINISTRATOR_ROLE])
        .then(([results]) => {
            if (results.length) return results[0].user_id;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group chats for a user. The group chats will be sorted such that the group chats
 * with the most recent messages are at the beginning of the array. Groups with no messages use their creation date
 * as the date of their most recent message instead.
 * 
 * @param {int} userId The id of the user to get the group chats for.
 * @returns On success, an array with the data of each group. Otherwise, ERROR.
 */
GroupModel.getGroupChats = (userId) => {
    /* We use COALESCE because groups can have 0 messages, in which case sorting by the chat message's creation date
     * would not work since it would be null. Therefore, use the group's creation date if there are no chat messages. */
    const selectSQL = `SELECT g.group_id, g.name, g.picture_thumbnail_path
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       LEFT OUTER JOIN chat_message cm ON g.group_id = cm.group_id
                       WHERE gu.user_id = ?
                       GROUP BY g.group_id
                       ORDER BY COALESCE(MAX(cm.creation_date), g.creation_date) DESC;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets a group's home page data.
 *
 * @param {int} groupId The id of the group to get the data of.
 * @returns On success, an object containing the group's name, description, announcement, picure path, admin's user id,
 *     admin's full name, and the number of members in the group. Otherwise, ERROR.
 */
GroupModel.getGroupHomeData = (groupId) => {
    /** The query that does what was stated in the function signature's comment. */
    const selectSQL = `SELECT g.name, g.description, g.announcement, g.picture_path, gu.user_id AS admin_id,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS admin_name,
                              (SELECT COUNT(*)
                               FROM group_user gu
                               WHERE g.group_id = gu.group_id) AS num_members
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       INNER JOIN user u ON gu.user_id = u.user_id
                       WHERE g.group_id = ? AND gu.role = ?;`;

    return database.query(selectSQL, [groupId, GROUP_ADMINISTRATOR_ROLE])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the number of members in a group.
 *
 * @param {int} groupId The id of the group to get the group members count of.
 * @returns If the group was found, the number of members in the group. Otherwise, ERROR.
 */
GroupModel.getGroupMemberCount = (groupId) => {
    const selectSQL = `SELECT COUNT(*) AS member_count
                       FROM group_user
                       WHERE group_id = ?;`;

    return database.query(selectSQL, [groupId])
        .then(([result]) => {
            if (result.length) return result[0].member_count;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the name of the group with the provided group ID.
 * 
 * @param {int} groupId The id of the group whose name we are trying to get.
 * @returns If a group was found, the group's name. Otherwise, ERROR.
 */
GroupModel.getGroupName = (groupId) => {
    const selectSQL = `SELECT name
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database.query(selectSQL, [groupId])
        .then(([results]) => {
            if (results.length) return results[0].name;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group's picture and picture thumbnail paths.
 *
 * @param {int} groupId The id of the group we are getting the picture paths of.
 * @returns If the group was found, an object containing the group's picture paths. Otherwise, ERROR.
 */
GroupModel.getGroupPicturePaths = (groupId) => {
    const selectSQL = `SELECT picture_path, picture_thumbnail_path
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database.query(selectSQL, [groupId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user data of all the users in a group. The results are sorted by group role, from highest to lowest.
 * 
 * @param {int} groupId The id of the group to get the group users of.
 * @returns On successful query, an array of users and their attributes. Otherwise, ERROR.
 */
GroupModel.getGroupUsers = (groupId) => {
    const selectSQL = `SELECT u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS full_name,
                              u.profile_picture_thumbnail_path, gu.role AS group_role
                       FROM group_user gu
                       INNER JOIN user u ON gu.user_id = u.user_id
                       WHERE gu.group_id = ?
                       ORDER BY gu.role DESC;`;

    return database.query(selectSQL, [groupId])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/** 
 * Gets the join code for a group. The join code is generated as follows:
 * Start with the group's picture path, and get the portion of the path before the file extension and after the slashes,
 * e.g. e4198f70-c454-4523-87f0-4325619d97fb. That is the join code.
 * 
 * @param {int} groupId The id of the group to get the join code of.
 * @returns If the group was found, the join code. Otherwise, ERROR.
 */
GroupModel.getJoinCode = (groupId) => {
    const selectSQL = `SELECT picture_path
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database
        .query(selectSQL, [groupId])
        .then(([results]) => {
            if (results.length) { // group found
                /** The path to the group's picture, e.g. public/group_pictures/231aa-bd58-47ab-b7a.png. */
                const picturePath = results[0].picture_path;

                /** The filename of the picture, e.g. 231aa-bd58-47ab-b7a.png. Whether the path uses '/' or '\' depends
                  * on the operating system, so we check which slash the path uses for the split. */
                const filename = picturePath.includes('/') ? picturePath.split('/')[2] : picturePath.split('\\')[2];

                return filename.split('.')[0]; // returns the join code, i.e. the filename without the extension
            } else { // no group found
                return ERROR;
            }
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the N most recent group chat messages for the specified group. The messages are sorted from oldest to newest.
 * If groupId is null, then we will get the Gator Chat messages, as it has no group id.
 * 
 * @param {int} groupId The id of the group to search for chat messages. If groupId is null,
 *     then it means get Gator Chat's messages.
 * @param {int} numMessages N, the maximum number of messages to get.
 * @returns An array with the data of each message. The array can be empty.
 */
GroupModel.getNChatMessages = (groupId, numMessages) => {
    /** Contains the params for the prepared statement. */
    let queryParams = [];
    /** The query that we will append to based on whether certain parameters were provided.
      * We select from a subquery to retrieve the last N messages from oldest to newest. */
    let selectSQL = `SELECT *
                     FROM (SELECT cm.chat_message_id, cm.sender_id, cm.body, cm.creation_date,
                                  CONCAT_WS(' ', u.first_name, u.last_name) AS sender_name
                           FROM chat_message cm
                           INNER JOIN user u ON cm.sender_id = u.user_id
                           WHERE cm.group_id `

    // Get the group's messages if a group ID is provided, otherwise get Gator Chat's messages
    if (groupId) {
        selectSQL += '= ? ';
        queryParams.push(groupId);
    } else {
        selectSQL += 'IS NULL ';
    }

    // Get the last N results from oldest to newest
    selectSQL += `    ORDER BY cm.chat_message_id DESC
                      LIMIT ?) AS temp
                  ORDER BY temp.chat_message_id ASC;`;
    queryParams.push(numMessages);

    return database.query(selectSQL, queryParams)
        .then(([result]) => { return result })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the role of the user in a group, even if they are not a member.
 *
 * @param {int} userId The id of the user we are trying to get the role of.
 * @param {int} groupId The id of the group we are searching in.
 *     Use null to indicate we are searching in Gator Chat or Gatormmunity Forums, in which case we return GROUP_MEMBER_ROLE.
 * @returns If the user is a member of the group, return an int indicating their role.
 *     If the user is not a member, return ERROR. If groupId is null, return GROUP_MEMBER_ROLE.
 */
GroupModel.getRole = (userId, groupId) => {
    // everyone is a member of Gator Chat and Gator Forums
    if (groupId === null || groupId === undefined) return Promise.resolve(GROUP_MEMBER_ROLE);

    const selectSQL = `SELECT role
                       FROM group_user
                       WHERE user_id = ? AND group_id = ?;`;

    return database.query(selectSQL, [userId, groupId])
        .then(([results]) => {
            if (results.length) return results[0].role;
            else return ERROR; // not a member
        })
        .catch((err) => Promise.reject(err));
};


/**
 * Gets the group data for all groups a user is in, in alphabetical order (A to Z).
 * 
 * @param {int} userId The id of the user we are doing the group searching for.
 * @returns An array containing the groups in ascending alphabetical order, or ERROR on error.
 */
GroupModel.getUsersGroups = (userId) => {
    const selectSQL = `SELECT g.group_id, g.name, g.picture_thumbnail_path,
                              (SELECT COUNT(*)
                               FROM group_user gu
                               WHERE g.group_id = gu.group_id) AS members_count
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       WHERE gu.user_id = ?
                       ORDER BY g.name ASC;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks whether a group exists.
 * 
 * @param {int} groupId The id of the group we are checking.
 * @returns If the group exists, `true`. Otherwise, `false`.
 */
GroupModel.groupExists = (groupId) => {
    const selectSQL = `SELECT group_id
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database.query(selectSQL, [groupId])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if a group's name already exists in the database.
 *
 * @param {string} groupName The name of the group we are searching for.
 * @returns If the group's name is already in use, `true`. Otherwise, `false`.
 */
GroupModel.groupNameExists = (groupName) => {
    const selectSQL = `SELECT group_id
                       FROM \`group\`
                       WHERE name = ?;`;

    return database.query(selectSQL, [groupName])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Sets the role of a group user.
 * 
 * @param {int} groupId The id of the group the user is in.
 * @param {int} userId The id of the user.
 * @param {int} role The integer role to set the user to.
 * @returns On successful query, the number of rows updated. Otherwise, ERROR.
 */
GroupModel.setRole = (groupId, userId, role) => {
    const updateSQL = `UPDATE group_user
                       SET role = ?
                       WHERE group_id = ? AND user_id = ?;`;

    return database.query(updateSQL, [role, groupId, userId])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = GroupModel;
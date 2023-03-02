const database = require("../config/dbConfig");
const GroupModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Adds a new group to the database with the provided arguments.
 *
 * @param {string} name The group's name.
 * @param {string} description The group's description. Can be null.
 * @param {string} picture_path The path to the group's picture.
 * @param {string} picture_thumbnail_path The path to the group's picture thumbnail.
 * @returns On success, the new group's group_id. Otherwise, -1.
 */
GroupModel.createGroup = (name, description, picture_path, picture_thumbnail_path) => {
    const insertSQL = `INSERT INTO \`group\` (name, description, picture_path, picture_thumbnail_path)
                       VALUES (?, ?, ?, ?);`;

    return database
        .query(insertSQL, [name, description, picture_path, picture_thumbnail_path])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Adds a user to a group with the given role.
 *
 * @param {int} group_id The id of the group the user is being added to.
 * @param {int} user_id The id of the user being added to the group.
 * @param {int} role The role of the user in the group. Should be from 1 to 3.
 * @returns On success, the id of the user who was inserted. Otherwise, -1.
 */
GroupModel.addGroupUser = (group_id, user_id, role) => {
    const insertUserSQL = `INSERT INTO group_user (group_id, user_id, role)
                           VALUES (?, ?, ?)`;
    return database
        .query(insertUserSQL, [group_id, user_id, role])
        .then(([results]) => {
            if (results.affectedRows) return user_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if a group's name is already in use.
 *
 * @param {string} group_name The name of the group we are checking.
 * @returns If the group's name is already in use, `true`. Otherwise, `false`.
 */
GroupModel.groupNameExists = (group_name) => {
    const selectSQL = "SELECT group_id FROM `group` WHERE name = ?;";

    return database
        .query(selectSQL, [group_name])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the name of the group with the provided group_id.
 * 
 * @param {int} group_id The id of the group whose name we are trying to get.
 * @returns On success, the group's name {string}. Otherwise, -1 {int}.
 */
GroupModel.getGroupName = (group_id) => {
    const selectSQL = "SELECT name FROM `group` WHERE group_id = ?;";

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => {
            if (results.length) return results[0].name;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the role of the user in a group, even if they are not a member.
 *
 * @param {int} user_id The id of the user we are trying to find the role of.
 * @param {int} group_id The id of the group we are searching in.
 *     Can be null to indicate we are searching in Gator Chat or the Gatormmunity Forums, in which case we return 1.
 * @returns If the user is a member of the group, an int from 1 to 3 indicating their role. If the user is not a member, -1.
 *     Returns 1 if group_id is null.
 */
GroupModel.getRole = (user_id, group_id) => {
    // everyone is a member of Gator Chat and Gator Forums
    if (group_id === null || group_id === undefined) return Promise.resolve(1);

    const selectSQL = `SELECT role
                       FROM group_user
                       WHERE user_id = ? AND group_id = ?;`;

    return database
        .query(selectSQL, [user_id, group_id])
        .then(([results]) => {
            if (results.length) return results[0].role;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Sets a group user's role. Returns the number of affected rows, or -1 if `results` is null. */
GroupModel.setRole = (group_id, user_id, role) => {
    const updateSQL = `UPDATE group_user
                       SET role = ?
                       WHERE group_id = ? AND user_id = ?;`;

    return database
        .query(updateSQL, [role, group_id, user_id])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks whether a group exists.
 * 
 * @param {int} group_id The id of the group we are checking.
 * @returns If the group exists, true. Otherwise, false.
 */
GroupModel.groupExists = (group_id) => {
    const selectSQL = `SELECT group_id
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => { return results.length })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group's name, description, announcement, picture path, admin's user id, admin's full name, and number of members.
 *
 * @param {int} group_id The id of the group to get the data of.
 * @returns On success, an object containing the group's attributes. Otherwise, -1.
 */
GroupModel.getGroupHomeData = (group_id) => {
    /** The query that does what was stated in the function signature's comment. */
    const selectSQL = `SELECT g.name, g.description, g.announcement, g.picture_path, gu.user_id AS admin_id,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS admin_name,
                              (SELECT COUNT(*)
                               FROM group_user gu
                               WHERE g.group_id = gu.group_id) AS num_members
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       INNER JOIN user u ON gu.user_id = u.user_id
                       WHERE g.group_id = ? AND gu.role = 3;`;

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the id of the group's admin.
 *
 * @param {int} group_id The id of the group we are getting the admin of.
 * @returns If there is an admin, we return their id. Otherwise, -1.
 */
GroupModel.getGroupAdminId = (group_id) => {
    const selectSQL = `SELECT user_id
                       FROM group_user
                       WHERE group_id = ? AND role = 3`;

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => {
            if (results.length) return results[0].user_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user data of all users in a group. The results are sorted from group admin to group member.
 * 
 * @param {int} group_id The id of the group to get the group users of.
 * @returns On success, an array of users and their attributes. Otherwise, -1.
 */
GroupModel.getGroupUsers = (group_id) => {
    const selectSQL = `SELECT u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS full_name,
                              u.profile_picture_thumbnail_path, gu.role AS group_role
                       FROM group_user gu
                       INNER JOIN user u ON gu.user_id = u.user_id
                       WHERE gu.group_id = ?
                       ORDER BY gu.role DESC;`;

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the number of members in a group with the specified group_id.
 *
 * @param {int} group_id The id of the group to get the group members count of.
 * @returns On success, the number of members in the group. Otherwise, -1.
 */
GroupModel.getGroupMemberCount = (group_id) => {
    const selectSQL = `SELECT COUNT(user_id) AS member_count
                       FROM group_user
                       WHERE group_id = ?;`;

    return database
        .query(selectSQL, [group_id])
        .then(([result]) => {
            if (result.length) return result[0].member_count;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group chats for the user with the specified user id. The group chats are sorted by the group's name,
 * in ascending alphabetical order.
 * 
 * @param {int} user_id The id of the user to get the group chats for.
 * @returns On success, an array with the data of each group. Otherwise, -1.
 */
GroupModel.getGroupChats = (user_id) => {
    const selectSQL = `SELECT g.group_id, g.name, g.picture_thumbnail_path
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       WHERE gu.user_id = ?
                       ORDER BY g.name ASC;`;

    return database
        .query(selectSQL, [user_id])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the N most recent group chat messages for the specified group. The messages are sorted from oldest to newest.
 * If group_id is null, then we will get the Gator Chat messages, as it has no group id.
 * 
 * @param {int} group_id The id of the group to search for chat messages. If group_id is null,
 *     then it means get Gator Chat's messages.
 * @param {int} numMessages N, the maximum number of messages to get.
 * @returns An array with the data of each message. Can be an empty array.
 */
GroupModel.getNChatMessages = (group_id, numMessages) => {
    /** Contains the params for the prepared statement. */
    let queryParams = [];
    // need to select from a subquery in order to retrieve the last N messages from oldest to newest
    let selectSQL = `SELECT *
                     FROM (SELECT cm.chat_message_id, cm.sender_id, cm.body, cm.creation_date,
                                  CONCAT_WS(' ', sender.first_name, sender.last_name) AS sender_name
                           FROM chat_message cm
                           INNER JOIN user sender ON sender.user_id = cm.sender_id
                           WHERE cm.group_id `

    // Get a group's messages if the group_id is provided, otherwise get Gator Chat's messages
    if (group_id) {
        selectSQL = selectSQL.concat('= ? ');
        queryParams.push(group_id);
    } else {
        selectSQL = selectSQL.concat('IS NULL ');
    }

    // Get the last N results from oldest to newest
    selectSQL = selectSQL.concat(`    ORDER BY cm.chat_message_id DESC
                                      LIMIT ?) AS temp
                                  ORDER BY temp.chat_message_id ASC;`);
    queryParams.push(numMessages);

    return database
        .query(selectSQL, queryParams)
        .then(([result]) => { return result })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a chat message into the database. If group_id is null, then the message is a Gator Chat message.
 * 
 * @param {string} body The contents of the chat message.
 * @param {int} group_id The id of the group to create the message in. Can be null,
 *     which indicates the message belongs to Gator Chat.
 * @param {int} sender_id The sender's user id.
 * @returns On success, the id of the newly created chat message. Otherwise, -1.
 */
GroupModel.createChatMessage = (body, group_id, sender_id) => {
    const insertSQL = `INSERT INTO chat_message (body, group_id, sender_id)
                       VALUES (?, ?, ?);`;

    return database
        .query(insertSQL, [body, group_id, sender_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** 
 * Gets the join code for a group. The join code is generated as follows:
 * Start with the group's picture_path, and get the portion of the path before the file extension and after the slashes,
 * e.g. e4198f70-c454-4523-87f0-4325619d97fb. That is the join code.
 * 
 * @param {int} group_id The id of the group to get the join code of.
 * @returns On success, the join code. Otherwise, -1.
 */
GroupModel.getJoinCode = (group_id) => {
    /** Computes the join code from a group's picture path.
      * Whether the path uses '/' or '\\' depends on the operating system, so we must account for both. */
    const getJoinCodeFromPicturePath = (picturePath) => {
        // Gets the filename from the picture's path, e.g. e4198f70-c454-4523-87f0-4325619d97fb.png.
        const filename = picturePath.includes('/') ? picturePath.split('/')[2] : picturePath.split('\\')[2];
        return filename.split('.')[0]; // returns the join code, i.e. the filename without the extension
    }

    const selectSQL = `SELECT picture_path
                       FROM \`group\`
                       WHERE group_id = ?;`;

    return database
        .query(selectSQL, [group_id])
        .then(([results]) => {
            if (results.length > 0) return getJoinCodeFromPicturePath(results[0].picture_path);
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Updates a group's announcement.
 *
 * @param {int} group_id The id of the group whose announcement is being changed.
 * @param {string} announcement The new announcement. It can be empty.
 * @returns The number of affected rows, or -1 if results is null.
 */
GroupModel.changeAnnouncement = (group_id, announcement) => {
    const updateSQL = `UPDATE \`group\` g
                       SET g.announcement = ?
                       WHERE g.group_id = ?;`;

    return database
        .query(updateSQL, [announcement, group_id])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the group user from the group.
  * On successful deletion, returns the group's id. Otherwise, returns -1. */
GroupModel.deleteGroupUser = (group_id, user_id) => {
    const deleteQuery = `DELETE FROM group_user
                         WHERE group_id = ? AND user_id = ?;`;

    return database
        .query(deleteQuery, [group_id, user_id])
        .then(([results]) => {
            if (results.affectedRows) return group_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group data for all groups the user is in.
 * 
 * @param {int} user_id The id of the user we are doing the group searching for.
 * @returns The results array if it is non-null, otherwise -1.
 */
GroupModel.getUsersGroups = (user_id) => {
    const selectSQL = `SELECT g.group_id, g.name, g.picture_thumbnail_path,
                              (SELECT COUNT(*)
                               FROM group_user gu
                               WHERE g.group_id = gu.group_id) AS members_count
                       FROM \`group\` g
                       INNER JOIN group_user gu ON g.group_id = gu.group_id
                       WHERE gu.user_id = ?;`;

    return database.query(selectSQL, [user_id])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the group's picture and picture thumbnail paths.

 * @param {int} group_id The id of the group we are getting the picture paths of.
 * @returns On success, an object containing the group's picture paths. On failure, -1.
 */
GroupModel.getGroupPicturePaths = (group_id) => {
    const selectQuery = `SELECT picture_path, picture_thumbnail_path
                         FROM \`group\`
                         WHERE group_id = ?;`;

    return database
        .query(selectQuery, [group_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the group from the database.
  * On successful deletion, returns the deleted group's id. Otherwise, returns -1. */
GroupModel.deleteGroup = (group_id) => {
    const deleteQuery = `DELETE FROM \`group\`
                         WHERE group_id = ?;`;

    return database
        .query(deleteQuery, [group_id])
        .then(([results]) => {
            if (results.affectedRows) return group_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = GroupModel;
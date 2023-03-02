const database = require("../config/dbConfig");
const UserModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Checks if an email is already in use by a user.
 * @returns If the email is in use, returns `true`. If it is not in use, returns `false`.
 */
UserModel.emailExists = (email) => {
    const selectSQL = "SELECT user_id FROM user WHERE email = ?";

    return database
        .query(selectSQL, [email])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if a user with the given user_id exists.
 * 
 * @param {int} user_id The id of the user we are checking.
 * @returns If the user exists, `true`. Otherwise, `false`.
 */
UserModel.userExists = (user_id) => {
    const selectSQL = "SELECT user_id FROM user WHERE user_id = ?;";

    return database
        .query(selectSQL, [user_id])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if an sfsu id number is already in use by a user.
 * @returns If the sfsu id number is in use, returns `true`. If it is not in use, returns `false`.
 */
UserModel.sfsuIdNumberExists = (sfsu_id_number) => {
    const selectSQL = `SELECT user_id FROM user WHERE sfsu_id_number = ?`;

    return database
        .query(selectSQL, [sfsu_id_number])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Adds a new user to the database with the provided arguments.
 * @return On success, returns the new user's user_id. On failure, returns -1.
 */
UserModel.createUser = (first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path, profile_picture_path,
    profile_picture_thumbnail_path) => {
    const insertSQL = `INSERT INTO user (first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path,
                                         profile_picture_path, profile_picture_thumbnail_path)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

    return database
        .query(insertSQL, [first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path,
            profile_picture_path, profile_picture_thumbnail_path])
        .then(([results]) => {
            // return the new user's id on successful insertion. on failure, return -1.
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

UserModel.updateProfilePicture = (user_id, profile_picture_path, profile_picture_thumbnail_path) => {
    /** Change the path of the user's profile picture and thumbnail to the one that was uploaded. */
    const updateQuery = `UPDATE user
                         SET profile_picture_path = ?,
                             profile_picture_thumbnail_path = ?
                         WHERE user_id = ?;`;

    return database
        .query(updateQuery, [profile_picture_path, profile_picture_thumbnail_path, user_id])
        .then(([results]) => {
            // on successful update, return the user's id, else return -1
            if (results.affectedRows) return user_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search the database for users who match the search terms and are of the desired role.
 *
 * @param {string} searchTerms The search terms that will be used for the LIKE operator. Can be null, to indicate
 *     that the user wants to search for all users.
 * @param {string} role The role to filter the matched users with. Can be null, to indicate a lack of a role filter.
 * @param {int} maxUsersReturned The maximum number of users the functions will return.
 * @returns An array containing `maxUsersReturned` most recently created users who match the search terms
 *     and the role filter. Can be an empty array, to indicate a lack of matches.
 */
UserModel.searchUsers = (searchTerms, role, maxUsersReturned) => {
    let queryParams = []; // params that will replace the question marks in the query

    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
					        profile_picture_thumbnail_path, role, join_date
					 FROM user `;

    // Add a role filter to the query, if a role was provided
    if (role) {
        selectSQL = selectSQL.concat(`WHERE role = ? `);
        queryParams.push(role);
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL = selectSQL.concat(`HAVING full_name LIKE ? `);
        queryParams.push(`%${searchTerms}%`);
    }

    // sort the results so that newest users are first, and set a maximum number of users to return
    selectSQL = selectSQL.concat(`ORDER BY user_id DESC
                                  LIMIT ?;`);
    queryParams.push(maxUsersReturned);

    return database
        .query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numUsers` most recently created users and their attributes for the search recommendation.
 *
 * @param {int} numUsers The number of users to return.
 * @returns Returns an array containing the `numUsers` most recently created users. Can be an empty array,
 *     which indicates the user table was empty.
 */
UserModel.getNRecommendedUsers = (numUsers) => {
    /** Get a maximum of `numUsers` users sorted from newest to oldest. */
    const selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
							  profile_picture_thumbnail_path, role, join_date							
					   FROM user
					   ORDER BY user_id DESC
					   LIMIT ?;`;

    return database
        .query(selectSQL, [numUsers])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user's profile data (first name, last name, picture, role, join date) given a user's id.

 * @param {int} user_id The id of the user we are getting the profile data of.
 * @returns On success, an object containing the user's profile data. On failure, -1.
 */
UserModel.getUserProfileData = (user_id) => {
    const selectQuery = `SELECT first_name, last_name, profile_picture_path, role, join_date
                         FROM user
                         WHERE user_id = ?;`;

    return database
        .query(selectQuery, [user_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user's role.

 * @param {int} user_id The id of the user we are getting the role of.
 * @returns The user's role, or -1 if the user does not exist.
 */
UserModel.getRole = (user_id) => {
    const selectQuery = `SELECT role
                         FROM user
                         WHERE user_id = ?;`;

    return database
        .query(selectQuery, [user_id])
        .then(([results]) => {
            if (results.length) return results[0].role;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user's sfsu id picture, profile picture, and profile picture thumbnail paths.

 * @param {int} user_id The id of the user we are getting the profile picture paths of.
 * @returns On success, an object containing the user's picture paths. On failure, -1.
 */
UserModel.getUserPicturePaths = (user_id) => {
    const selectQuery = `SELECT sfsu_id_picture_path, profile_picture_path, profile_picture_thumbnail_path
                         FROM user
                         WHERE user_id = ?;`;

    return database
        .query(selectQuery, [user_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the full name of the user with the given user id.
 * 
 * @param {int} user_id The id of the user to get the name of.
 * @returns On success, the full name of the user. Otherwise, -1.
 */
UserModel.getFullName = (user_id) => {
    const selectSQL = `SELECT CONCAT_WS(' ', first_name, last_name) AS full_name
                       FROM user
                       WHERE user_id = ?;`;

    return database
        .query(selectSQL, [user_id])
        .then(([results]) => {
            if (results.length) return results[0].full_name;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Gets all the unapproved users from the database for the moderators/administrators to approve them. */
UserModel.getUnapprovedUsers = () => {
    const selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, email,
                              sfsu_id_number, sfsu_id_picture_path, join_date
                       FROM user
                       WHERE role = 0;`;

    return database
        .query(selectSQL)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/** Sets a user's role. Returns the user's id on success, -1 otherwise. */
UserModel.setRole = (user_id, role) => {
    const updateQuery = `UPDATE user
                         SET role = ?
                         WHERE user_id = ?;`;

    return database
        .query(updateQuery, [role, user_id])
        .then(([results]) => {
            if (results.affectedRows) return user_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the user from the database. Should delete their pictures first. 
  * On successful deletion, return the deleted user's id. Otherwise, returns -1. */
UserModel.deleteUser = (user_id) => {
    const deleteQuery = `DELETE FROM user WHERE user_id = ?;`;

    return database
        .query(deleteQuery, [user_id])
        .then(([results]) => {
            if (results.affectedRows) return user_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

/** Bans a user with the target id. The caller should verify that the banner is a moderator or above.
  * Returns the number of users who were banned on successful database update, or -1 on error. */
UserModel.banUser = (bannerUserId, targetUserId) => {
    const updateQuery = `UPDATE user
                         SET banned_by_id = ?
                         WHERE user_id = ?;`;

    return database
        .query(updateQuery, [bannerUserId, targetUserId])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

module.exports = UserModel;
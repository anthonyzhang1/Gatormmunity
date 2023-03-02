/* This file contains all of the database queries related to the user table. */

const database = require("../config/dbConfig");
const { ERROR, UNAPPROVED_USER_ROLE } = require("../helpers/Constants");
const UserModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Ban a user with the target id.
 * 
 * @param {int} bannerUserId The id of the user who is doing the banning.
 * @param {int} targetUserId The id of the user being banned.
 * @returns The number of users who were banned, or ERROR on error.
 */
UserModel.banUser = (bannerUserId, targetUserId) => {
    const updateSQL = `UPDATE user
                       SET banned_by_id = ?
                       WHERE user_id = ?;`;

    return database.query(updateSQL, [bannerUserId, targetUserId])
        .then(([results]) => {
            if (results) return results.affectedRows;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Adds a new user to the database.
 * 
 * @param {string} firstName The user's first name.
 * @param {string} lastName The user's last name.
 * @param {string} email The user's email.
 * @param {int} sfsuIdNumber The user's SFSU ID number.
 * @param {string} sfsuIdPicturePath The path to the user's SFSU ID picture.
 * @param {string} profilePicturePath The path to the user's profile picture.
 * @param {string} profilePictureThumbnailPath The path to the user's profile picture thumbnail.
 * @returns On successful insertion, the new user's ID. Otherwise, ERROR.
 */
UserModel.createUser = (firstName, lastName, email, sfsuIdNumber, sfsuIdPicturePath,
    profilePicturePath, profilePictureThumbnailPath) => {
    const insertSQL = `INSERT INTO user (first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path,
                                         profile_picture_path, profile_picture_thumbnail_path)
                       VALUES (?, ?, ?, ?, ?, ?, ?);`;

    return database.query(insertSQL, [firstName, lastName, email, sfsuIdNumber, sfsuIdPicturePath,
        profilePicturePath, profilePictureThumbnailPath])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes the user from the database.
 * 
 * @param {int} userId The id of the user being deleted.
 * @returns On successful deletion, `userId`. Otherwise, ERROR.
 */
UserModel.deleteUser = (userId) => {
    const deleteSQL = `DELETE FROM user
                       WHERE user_id = ?;`;

    return database.query(deleteSQL, [userId])
        .then(([results]) => {
            if (results.affectedRows) return userId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if an email is already in use by a user.
 * 
 * @param {string} email The email to check.
 * @returns If the email is being used, `true`. Otherwise, `false`.
 */
UserModel.emailExists = (email) => {
    const selectSQL = `SELECT user_id
                       FROM user
                       WHERE email = ?;`;

    return database.query(selectSQL, [email])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the full name of a user.
 * 
 * @param {int} userId The id of the user.
 * @returns If the user was found, their full name. Otherwise, ERROR.
 */
UserModel.getFullName = (userId) => {
    const selectSQL = `SELECT CONCAT_WS(' ', first_name, last_name) AS full_name
                       FROM user
                       WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results.length) return results[0].full_name;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numUsers` most recently created users.
 *
 * @param {int} numUsers The maximum number of users to return.
 * @returns An array with the most recently created users. The array can be empty, meaning there are no users.
 */
UserModel.getNRecommendedUsers = (numUsers) => {
    /** Get a maximum of `numUsers` users sorted from newest to oldest. */
    const selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
							  profile_picture_thumbnail_path, role, join_date							
					   FROM user
					   ORDER BY user_id DESC
					   LIMIT ?;`;

    return database.query(selectSQL, [numUsers])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets a user's role as an integer.
 *
 * @param {int} userId The id of the user we are getting the role of.
 * @returns If the user was found, the user's integer role. Otherwise, ERROR.
 */
UserModel.getRole = (userId) => {
    const selectSQL = `SELECT role
                       FROM user
                       WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results.length) return results[0].role;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets all of the unapproved users and their data.
 * 
 * @returns An array of users and their data.
 */
UserModel.getUnapprovedUsers = () => {
    const selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, email,
                              sfsu_id_number, sfsu_id_picture_path, join_date
                       FROM user
                       WHERE role = ?;`;

    return database.query(selectSQL, [UNAPPROVED_USER_ROLE])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets a user's SFSU ID picture, profile picture, and profile picture thumbnail paths.
 *
 * @param {int} userId The id of the user we are getting the picture paths of.
 * @returns If the user was found, an object containing the user's picture paths. Otherwise, ERROR.
 */
UserModel.getUserPicturePaths = (userId) => {
    const selectSQL = `SELECT sfsu_id_picture_path, profile_picture_path, profile_picture_thumbnail_path
                       FROM user
                       WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets a user's profile data.
 *
 * @param {int} userId The id of the user we are getting the profile data of.
 * @returns If the user was found, an object with the user's first name, last name, picture, role, and join date.
 *     Otherwise, ERROR.
 */
UserModel.getUserProfileData = (userId) => {
    const selectSQL = `SELECT first_name, last_name, profile_picture_path, role, join_date
                       FROM user
                       WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search for users who match the search terms and are of the desired role.
 *
 * @param {string} searchTerms The search terms. If null, search for users of any name.
 * @param {int} role The user role to filter the matched users with. If null, search for users of any role.
 * @param {int} maxUsersReturned The maximum number of users returned.
 * @returns An array containing `maxUsersReturned` most recently created users who match the search terms and filters.
 *     Can be an empty array, indicating a lack of matches.
 */
UserModel.searchUsers = (searchTerms, role, maxUsersReturned) => {
    /** Contains the params for the prepared statement. */
    let queryParams = [];
    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT user_id, CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
					        profile_picture_thumbnail_path, role, join_date
					 FROM user `;

    // Add a role filter to the query, if a role was provided
    if (role) {
        selectSQL += 'WHERE role = ? ';
        queryParams.push(role);
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL += 'HAVING full_name LIKE ? ';
        queryParams.push(`%${searchTerms}%`);
    }

    // sort the users so that the newest users are first, and set a maximum number of users to return
    selectSQL += `ORDER BY user_id DESC
                  LIMIT ?;`;
    queryParams.push(maxUsersReturned);

    return database.query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Sets a user's role.
 * 
 * @param {int} userId The id of the user whose role is being set.
 * @param {int} role The new integer role.
 * @returns On successful update, `userId`. Otherwise, ERROR.
 */
UserModel.setRole = (userId, role) => {
    const updateSQL = `UPDATE user
                       SET role = ?
                       WHERE user_id = ?;`;

    return database.query(updateSQL, [role, userId])
        .then(([results]) => {
            if (results.affectedRows) return userId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if an SFSU ID number is already in use by a user.
 * 
 * @param {int} sfsuIdNumber The SFSU ID number to check.
 * @returns If the SFSU ID number is being used, `true`. Otherwise, `false`.
 */
UserModel.sfsuIdNumberExists = (sfsuIdNumber) => {
    const selectSQL = `SELECT user_id
                       FROM user
                       WHERE sfsu_id_number = ?;`;

    return database.query(selectSQL, [sfsuIdNumber])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if a user with the given user ID exists.
 * 
 * @param {int} userId The id of the user we are checking.
 * @returns If the user exists, `true`. Otherwise, `false`.
 */
UserModel.userExists = (userId) => {
    const selectSQL = `SELECT user_id
                       FROM user
                       WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => { return results.length > 0 })
        .catch((err) => Promise.reject(err));
};

/**
 * Update the user's profile picture and profile picture thumbnail paths.
 * 
 * @param {int} userId The id of the user whose paths are being changed.
 * @param {string} profilePicturePath The path of the new profile picture.
 * @param {string} profilePictureThumbnailPath The path of the new profile picture thumbnail.
 * @returns On successful update, `userId`. Otherwise, ERROR.
 */
UserModel.updateProfilePicture = (userId, profilePicturePath, profilePictureThumbnailPath) => {
    const updateSQL = `UPDATE user
                       SET profile_picture_path = ?,
                           profile_picture_thumbnail_path = ?
                       WHERE user_id = ?;`;

    return database.query(updateSQL, [profilePicturePath, profilePictureThumbnailPath, userId])
        .then(([results]) => {
            if (results.affectedRows) return userId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = UserModel;
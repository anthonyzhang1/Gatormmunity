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
        .then(([results]) => {
            // returns true if the email is already taken. otherwise, returns false.
            return results.length > 0;
        })
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
        .then(([results]) => {
            // returns true if the sfsu id number is already taken. otherwise, returns false.
            return results.length > 0;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Adds a new user to the database with the provided arguments.
 * @return On success, returns the new user's user_id. On failure, returns -1.
 */
UserModel.addNewUser = (
    first_name,
    last_name,
    email,
    sfsu_id_number,
    sfsu_id_picture_path,
    profile_picture_path,
    profile_picture_thumbnail_path,
    role
) => {
    // SQL query that inserts the user into the user table
    const insertUserSQL = `INSERT INTO user (first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path,
                                             profile_picture_path, profile_picture_thumbnail_path, role)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    return database
        .query(insertUserSQL, [
            first_name,
            last_name,
            email,
            sfsu_id_number,
            sfsu_id_picture_path,
            profile_picture_path,
            profile_picture_thumbnail_path,
            role,
        ])
        .then(([results]) => {
            // return the new user's id on successful insertion. on failure, return -1.
            if (results.affectedRows) {
                return results.insertId;
            } else {
                return -1;
            }
        })
        .catch((err) => Promise.reject(err));
};

UserModel.changeProfilePicture = (user_id, profile_picture_path, profile_picture_thumbnail_path) => {
    /** Change the path of the user's profile picture and thumbnail to the one that was uploaded. */
    const query = `UPDATE user
                   SET profile_picture_path = ?,
                       profile_picture_thumbnail_path = ?
                   WHERE user_id = ?;`;

    return database.query(query, [profile_picture_path, profile_picture_thumbnail_path, user_id])
        .then(([results]) => {
            // on successful update, return the user's id, else return -1
            if (results.affectedRows) {
                return user_id;
            } else {
                return -1;
            }
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numSearchResults` most recently created users and their attributes for the search recommendation.
 *
 * @param {int} numSearchResults N, the number of recommended users this function will return.
 * @returns Returns an array containing the `numSearchResults` most recently created users containing their attributes
 *     from the SELECT query. Can be an empty array, which means the user table was empty.
 */
UserModel.getNRecommendedUsers = (numSearchResults) => {
    // get a maximum of numSearchResults users sorted from newest to oldest
    const searchUserSQL = `SELECT CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
								  profile_picture_thumbnail_path, role, join_date								
						   FROM user
						   ORDER BY user_id DESC
						   LIMIT ?;`;

    return database
        .query(searchUserSQL, [numSearchResults])
        .then(([results]) => {
            return results;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search the database for users who match the search terms and are of the desired role. The users will be returned.
 *
 * @param {string} searchTerms The search terms that will be used for the LIKE %x% operator. Can be an empty string, to indicate
 *     that the user wants to search for all users.
 * @param {string} role The role to filter the search terms with. Can be an empty string, to indicate a lack of a role filter.
 * @param {int} maxUsersReturned The maximum number of users the functions will return.
 * @returns Returns an array containing `maxUsersReturned` most recently created users who match the search terms
 *     and the role filter. Can be an empty array, to indicate a lack of matches.
 */
UserModel.searchUsers = (searchTerms, role, maxUsersReturned) => {
    const sqlSearchTerms = `%${searchTerms}%`; // has to be outside of the query for searchUserSQL to work
    let queryParams = []; // Params for the query

    // The base query
    const baseQuery = `SELECT CONCAT_WS(' ', first_name, last_name) AS full_name, profile_picture_path,
							  profile_picture_thumbnail_path, role, join_date
					   FROM user`;
    let searchUserSQL = baseQuery; // we will append to this copy of the base query

    // Add a role filter to the query, if a role was provided
    if (role.length > 0) {
        queryParams.push(role); // add role to the query params
        searchUserSQL = searchUserSQL.concat(` WHERE role = ?`);
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms.length > 0) {
        queryParams.push(sqlSearchTerms); // add searchTerms to the query params
        searchUserSQL = searchUserSQL.concat(` HAVING full_name LIKE ?`);
    }

    // sort the results so that newest users are first, and set a maximum number of users to return
    queryParams.push(maxUsersReturned); // add maxUsersReturned to the query params
    searchUserSQL = searchUserSQL.concat(` ORDER BY user_id DESC
										  LIMIT ?;`);

    return database
        .query(searchUserSQL, queryParams)
        .then(([results]) => {
            return results;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = UserModel;

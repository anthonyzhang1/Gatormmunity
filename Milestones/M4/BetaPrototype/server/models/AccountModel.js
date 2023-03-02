const bcrypt = require("bcrypt");
const database = require("../config/dbConfig");
const AccountModel = {}; // all of the functions are stored here, which will then be exported
const bcryptSaltRounds = 10; // how many rounds the plaintext password will be salted

/**
 * Adds a new account to the database with the provided arguments. This function will hash the password for you.

 * @param {string} plaintextPassword The plaintext password to be inserted into the `account` table.
 *     The password will be hashed before insertion.
 * @param {int} user_id The user id that the account will belong to.
 * @returns If account creation was successful, returns the account's id. Otherwise, return -1.
 */
AccountModel.createAccount = (plaintextPassword, user_id) => {
    return bcrypt
        .hash(plaintextPassword, bcryptSaltRounds) // hash the user's plaintext password
        .then((hashedPassword) => {
            const insertSQL = `INSERT INTO account (password, user_id) VALUES (?, ?)`;

            // insert the account credentials into the database
            return database.query(insertSQL, [hashedPassword, user_id]);
        })
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Checks if the sfsu_id_number and the plaintext password are the correct login credentials for the user's account.
 * Also returns data needed for the user's login session.
 *
 * @param {string} plaintextPassword The password the user entered in plaintext.
 * @returns If the credentials are correct, an object containing the user's data. Otherwise, -1.
 */
AccountModel.authenticateUser = (sfsu_id_number, plaintextPassword) => {
    let userData = {}; // to be returned to the caller

    /** Get the user's data and the hashed password of the account with the given sfsu ID number */
    const selectSQL = `SELECT u.user_id, u.first_name, u.profile_picture_thumbnail_path, u.role, u.banned_by_id, a.password
					   FROM user u
                       INNER JOIN account a ON u.user_id = a.user_id
					   WHERE u.sfsu_id_number = ?;`;

    return database
        .query(selectSQL, [sfsu_id_number])
        .then(([results]) => {
            if (results.length) { // if an account was found with the given sfsu ID number, check if the password is correct
                userData = results[0];

                // check if the plaintext password entered matches the hashed password in the database
                return bcrypt.compare(plaintextPassword, results[0].password);
            } else { // no such user with the provided sfsu ID number
                return false;
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) return userData;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Returns the data needed for a user's session.
 *
 * @param {int} user_id The user's id.
 * @returns On success, an object containing the user's session data. Otherwise, -1.
 */
 AccountModel.getUserSessionData = (user_id) => {
    if (!user_id) return Promise.resolve(-1); // if the user is not logged in, return -1

    const selectSQL = `SELECT u.user_id, u.first_name, u.profile_picture_thumbnail_path, u.role
					   FROM user u
					   WHERE u.user_id = ?;`;

    return database
        .query(selectSQL, [user_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = AccountModel;
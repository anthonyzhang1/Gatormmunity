/* This file contains all of the database queries related to the account table. */

const bcrypt = require("bcrypt");
const database = require("../config/dbConfig");
const { ERROR } = require("../helpers/Constants");
const AccountModel = {}; // all of the functions are stored here, which will then be exported

/** How many rounds bcrypt will hash the plaintext password. */
const bcryptHashRounds = 10;

/**
 * Checks if the SFSU ID number and the plaintext password are the correct login credentials for the user's account.
 * Also, gets the data needed for the user's login session.
 *
 * @param {int} sfsuIdNumber The user's SFSU ID number to authenticate.
 * @param {string} plaintextPassword The user's plaintext password to authenticate.
 * @returns If the credentials are correct, an object containing the user's data. Otherwise, ERROR.
 */
AccountModel.authenticateUser = (sfsuIdNumber, plaintextPassword) => {
    let userData = {}; // to be returned to the caller

    /** Get the user's data and the hashed password of the account with the given SFSU ID number. */
    const selectSQL = `SELECT u.user_id, u.first_name, u.profile_picture_thumbnail_path, u.role, u.banned_by_id, a.password
					   FROM user u
                       INNER JOIN account a ON u.user_id = a.user_id
					   WHERE u.sfsu_id_number = ?;`;

    return database.query(selectSQL, [sfsuIdNumber])
        .then(([results]) => {
            if (results.length) { // if an account was found with the given sfsu ID number, check if the password is correct
                userData = results[0]; // save the results to return later

                // check if the plaintext password matches the hashed password
                return bcrypt.compare(plaintextPassword, results[0].password);
            } else { // no such user with the provided SFSU ID number
                return false;
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) return userData;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Changes a user's password. The plaintext password is hashed by the function.
 *
 * @param {string} plaintextPassword The new password for the user, in plaintext.
 * @param {int} userId The ID of the user whose password is being changed.
 * @returns On successful update, `userId`. Otherwise, ERROR.
 */
AccountModel.changePassword = (plaintextPassword, userId) => {
    return bcrypt.hash(plaintextPassword, bcryptHashRounds) // hash the user's new plaintext password
        .then((hashedPassword) => {
            const updateSQL = `UPDATE account
                               SET password = ?
                               WHERE user_id = ?;`;

            return database.query(updateSQL, [hashedPassword, userId]); // sets the new hashed password
        })
        .then(([results]) => {
            if (results.affectedRows) return userId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Adds a new account to the database with the provided arguments. The password is hashed by the function.
 *
 * @param {string} plaintextPassword The plaintext password of the account that will be hashed.
 * @param {int} userId The user id that the account will belong to.
 * @returns If account creation was successful, the account's id. Otherwise, ERROR.
 */
AccountModel.createAccount = (plaintextPassword, userId) => {
    return bcrypt.hash(plaintextPassword, bcryptHashRounds) // hash the user's plaintext password
        .then((hashedPassword) => {
            const insertSQL = `INSERT INTO account (password, user_id)
                               VALUES (?, ?);`;

            return database.query(insertSQL, [hashedPassword, userId]); // insert the account with the hashed password
        })
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the data needed for a user's session as well as the user's ban status.
 *
 * @param {int} userId The id of the user to get the data of.
 * @returns On success, an object containing the user's data. Otherwise, ERROR.
 */
AccountModel.getUserSessionData = (userId) => {
    if (!userId) return Promise.resolve(ERROR); // if the user is not logged in, return ERROR

    const selectSQL = `SELECT user_id, first_name, profile_picture_thumbnail_path, role, banned_by_id
					   FROM user
					   WHERE user_id = ?;`;

    return database.query(selectSQL, [userId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = AccountModel;
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
AccountModel.addNewAccount = (plaintextPassword, user_id) => {
	return bcrypt
		.hash(plaintextPassword, bcryptSaltRounds) // hash the user's plaintext password
		.then((hashedPassword) => {
			// SQL query to insert the account credentials into the account table
			const insertSQL = `INSERT INTO account (password, user_id) VALUES (?, ?)`;

			// insert the account credentials into the database
			return database.query(insertSQL, [hashedPassword, user_id]);
		})
		.then(([results]) => {
			// on successful account creation, return the account id. on failure, return -1.
			if (results.affectedRows) {
				return results.insertId;
			} else {
				return -1;
			}
		})
		.catch((err) => Promise.reject(err));
};

/**
 * Checks if the sfsu_id_number and the plaintext password are the correct login credentials for the user's account.
 * Also returns data needed for the user's login session.
 * 
 * @param {string} plaintextPassword The password the user entered in plaintext.
 * @returns If the credentials are correct, returns an object containing the user's user_id, first_name,
 *     profile_picture_path, profile_picture_thumbnail_path, and role.
 *     If the credentials are incorrect, returns -1.
 */
AccountModel.authenticate = (sfsu_id_number, plaintextPassword) => {
	let returnData = {}; // to be returned to the caller

	// Get the user's data and the password of the account associated with the provided sfsu_id_number
	const loginSQL = `SELECT u.user_id, u.first_name, u.profile_picture_path, u.profile_picture_thumbnail_path, u.role,
							 a.password
					  FROM user u INNER JOIN account a
					  ON u.user_id = a.user_id
					  WHERE u.sfsu_id_number = ?;`;

	return database
		.query(loginSQL, [sfsu_id_number])
		.then(([results]) => {
			// if an account was found with the given sfsu_id_number, check if the password is correct
			// otherwise, return false to the next .then()
			if (results.length > 0) {
				// save the data returned from the query so we can return it to the caller later
				returnData.user_id = results[0].user_id;
				returnData.first_name = results[0].first_name;
				returnData.profile_picture_path = results[0].profile_picture_path;
				returnData.profile_picture_thumbnail_path = results[0].profile_picture_thumbnail_path;
				returnData.role = results[0].role;
				
				// check if the plaintext password entered matches the hashed password in the database
				return bcrypt.compare(plaintextPassword, results[0].password);
			} else {
				return false;
			}
		})
		.then((passwordsMatch) => {
			// if the password entered matches the hashed password, return the returnData object. otherwise, return -1
			if (passwordsMatch) {
				return returnData;
			} else {
				return -1;
			}
		})
		.catch((err) => Promise.reject(err));
};

module.exports = AccountModel;
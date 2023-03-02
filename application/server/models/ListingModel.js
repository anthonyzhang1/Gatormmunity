/* This file contains all of the database queries related to the listing table. */

const database = require("../config/dbConfig");
const { ERROR, LISTING_TYPE_CHAR } = require("../helpers/Constants");
const ListingModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Inserts a new listing into the database.
 * 
 * @param {string} title The listing's title.
 * @param {string} description The listing's description.
 * @param {float} price The listing's price in a valid currency format, e.g. 21.55 or 21.
 * @param {string} category The listing's category.
 * @param {string} imagePath The path to the listing's image.
 * @param {string} imageThumbnailPath The path to the listing image's thumbnail.
 * @param {int} sellerId The id of the user who created the listing.
 * @returns On successful insertion, the new listing's id. Otherwise, ERROR.
 */
ListingModel.createListing = (title, description, price, category, imagePath, imageThumbnailPath, sellerId) => {
    const insertSQL = `INSERT INTO listing (title, description, price, category, image_path, image_thumbnail_path, seller_id)
                       VALUES (?, ?, ?, ?, ?, ?, ?);`;

    return database.query(insertSQL, [title, description, price, category, imagePath, imageThumbnailPath, sellerId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes the listing from the database.
 * 
 * @param {int} listingId The id of the listing to delete.
 * @returns On successful deletion, `listingId`. Otherwise, ERROR.
 */
ListingModel.deleteListing = (listingId) => {
    const deleteSQL = `DELETE FROM listing
                       WHERE listing_id = ?;`;

    return database.query(deleteSQL, [listingId])
        .then(([results]) => {
            if (results.affectedRows) return listingId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the data needed to view a listing.
 * 
 * @param {int} listingId The id of the listing.
 * @returns If a listing was found, an object with the listing's data. Otherwise, ERROR.
 */
ListingModel.getListingData = (listingId) => {
    /** Query to retrieve the listing's data, as well as the seller's name and email. */
    const selectSQL = `SELECT l.title, l.description, l.price, l.category, l.image_path, l.seller_id,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS seller_name, u.email
                       FROM listing l
                       INNER JOIN user u ON l.seller_id = u.user_id
                       WHERE l.listing_id = ?;`;

    return database.query(selectSQL, [listingId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the listing's picture and picture thumbnail paths.
 *
 * @param {int} listingId The id of the listing we are getting the picture paths of.
 * @returns If the listing was found, an object containing the listing's picture paths. Otherwise, ERROR.
 */
ListingModel.getListingPicturePaths = (listingId) => {
    const selectSQL = `SELECT image_path, image_thumbnail_path
                       FROM listing
                       WHERE listing_id = ?;`;

    return database.query(selectSQL, [listingId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the id, title, and price from the `numListings` most recently created listings.
 * 
 * @param {int} numListings The maximum number of listings to return.
 * @returns An array with the listings, or ERROR on error.
 */
ListingModel.getNRecentListingIdTitlePrice = (numListings) => {
    const selectSQL = `SELECT listing_id, title, price
                       FROM listing
                       ORDER BY listing_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [numListings])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numListings` most recently created listings.
 *
 * @param {int} numListings The number of listings to return.
 * @returns An array with the most recently created listings. The array can be empty, meaning there are no listings.
 */
ListingModel.getNRecommendedListings = (numListings) => {
    /** Get a maximum of `numListings` listings sorted from newest to oldest. */
    const selectSQL = `SELECT listing_id, title, price, image_thumbnail_path
                       FROM listing
                       ORDER BY listing_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [numListings])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the user id of a listing's seller.
 * 
 * @param {int} listingId The id of the listing.
 * @returns If the listing was found, the seller's user id. Otherwise, ERROR.
 */
ListingModel.getSellerId = (listingId) => {
    const selectSQL = `SELECT seller_id
                       FROM listing
                       WHERE listing_id = ?;`;

    return database.query(selectSQL, [listingId])
        .then(([results]) => {
            if (results.length) return results[0].seller_id;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Finds a user's last `numListings` created listings, and gets their listing id, title, and type (LISTING_TYPE_CHAR).
 * 
 * @param {int} userId The id of the user we are doing the search for.
 * @param {int} numListings The maximum number of listings to return.
 * @returns The array of listings, or ERROR on error.
 */
ListingModel.getUserNLastListings = (userId, numListings) => {
    const selectSQL = `SELECT l.listing_id, l.title, l.creation_date, ? AS type
                       FROM listing l
                       INNER JOIN user u ON l.seller_id = u.user_id
                       WHERE u.user_id = ?
                       ORDER BY l.listing_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [LISTING_TYPE_CHAR, userId, numListings])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search for listings that match the search terms and are of the desired category and price range.
 * 
 * @param {string} searchTerms The search terms. If null, search for listings of any title.
 * @param {string} category The listing category to filter the matched listings with.
 *     If null, search for listings of any category.
 * @param {float} maxPrice The maximum price to filter the matched listings with. If null, search for listings of any price.
 * @param {int} maxListingsReturned The maximum number of listings to return.
 * @returns An array containing `maxListingsReturned` most recently created listings that match the search terms and filters.
 *     Can be an empty array, indicating a lack of matches.
 */
ListingModel.searchListings = (searchTerms, category, maxPrice, maxListingsReturned) => {
    /** Contains the params for the prepared statement. */
    let queryParams = [];
    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT listing_id, title, price, image_thumbnail_path
                     FROM listing `;

    // if any filters were applied, add a WHERE statement. maxPrice can be 0, so we need to check for null explicitly.
    if (category || maxPrice !== null) {
        selectSQL += 'WHERE ';

        // Add a category filter to the query, if a category was provided
        if (category) {
            selectSQL += 'category = ? '
            queryParams.push(category);
        }

        // if both category and a max price filter were provided
        if (category && maxPrice !== null) selectSQL += 'AND ';

        // Add a price filter to the query, if a max price was provided
        if (maxPrice !== null) {
            selectSQL += 'price <= ? ';
            queryParams.push(maxPrice);
        }
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL += 'HAVING title LIKE ? ';
        queryParams.push(`%${searchTerms}%`);
    }

    // sort the listings so that the newest listings are first, and set a maximum number of listings to return
    selectSQL += `ORDER BY listing_id DESC
				  LIMIT ?;`;
    queryParams.push(maxListingsReturned);

    return database.query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

module.exports = ListingModel;
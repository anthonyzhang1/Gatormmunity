const database = require("../config/dbConfig");
const ListingModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Gets the data needed to view a listing.
 * 
 * @param {int} listing_id The id of the listing.
 * @returns On success, an object with the listing's data. Otherwise, -1.
 */
ListingModel.getListingData = (listing_id) => {
    /** Query to retrieve the listing's data, as well as the seller's full name and email. */
    const selectQuery = `SELECT l.title, l.description, l.price, l.category, l.image_path, l.seller_id,
                                CONCAT_WS(' ', u.first_name, u.last_name) AS seller_name, u.email
                         FROM listing l
                         INNER JOIN user u ON l.seller_id = u.user_id
                         WHERE l.listing_id = ?;`;

    return database
        .query(selectQuery, [listing_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the listing's picture and picture thumbnail paths.

 * @param {int} listing_id The id of the listing we are getting the picture paths of.
 * @returns On success, an object containing the listing's picture paths. On failure, -1.
 */
ListingModel.getListingPicturePaths = (listing_id) => {
    const selectQuery = `SELECT image_path, image_thumbnail_path
                         FROM listing
                         WHERE listing_id = ?;`;

    return database
        .query(selectQuery, [listing_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the seller id of a listing.
 * 
 * @param {int} listing_id The id of the listing we are getting the data for.
 * @returns The seller's id, or -1 if no matches were found.
 */
ListingModel.getSellerId = (listing_id) => {
    const selectQuery = `SELECT seller_id
                         FROM listing
                         WHERE listing_id = ?;`;

    return database
        .query(selectQuery, [listing_id])
        .then(([results]) => {
            if (results.length) return results[0].seller_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

/**
 * Inserts a new listing into the database.
 * 
 * @param {string} title The listing's title.
 * @param {string} description The listing's description.
 * @param {float} price The listing's price in a valid currency format, e.g. 21.55 or 21.
 * @param {string} category The listing's category.
 * @param {string} image_path Path to the listing's image.
 * @param {string} image_thumbnail_path Path to the listing's image thumbnail.
 * @param {int} seller_id The id of the person who created the listing.
 * @returns On success, the new listing's listing id. On failure, -1.
 */
ListingModel.createListing = (title, description, price, category, image_path, image_thumbnail_path, seller_id) => {
    const insertSQL = `INSERT INTO listing (title, description, price, category, image_path, image_thumbnail_path, seller_id)
                       VALUES (?, ?, ?, ?, ?, ?, ?);`;

    return database
        .query(insertSQL, [title, description, price, category, image_path, image_thumbnail_path, seller_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the listing from the database.
  * On successful deletion, returns the deleted listing's id. Otherwise, returns -1. */
ListingModel.deleteListing = (listing_id) => {
    const deleteQuery = `DELETE FROM listing
                         WHERE listing_id = ?;`;

    return database
        .query(deleteQuery, [listing_id])
        .then(([results]) => {
            if (results.affectedRows) return listing_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search the database for listings that match the search terms and are of the desired category and price range.
 * 
 * @param {string} searchTerms The search terms that will be used for the LIKE operator. Can be null,
 *     to indicate that the user wants to search for all listings.
 * @param {string} category The listing category to filter the matched listings with. Can be null,
 *     to indicate a lack of a category filter.
 * @param {float} maxPrice The maximum price to filter the matched listings with. Can be null,
 *     to indicate a lack of max price filter.
 * @param {int} maxListingsReturned The maximum number of listings the functions will return.
 * @returns An array containing `maxListingsReturned` most recently created listings that match the search terms
 *     and filters. Can be an empty array, to indicate a lack of matches.
 */
ListingModel.searchListings = (searchTerms, category, maxPrice, maxListingsReturned) => {
    let queryParams = []; // params that will replace the question marks in the query

    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT listing_id, title, price, image_thumbnail_path
                     FROM listing `;

    // if any filters were applied, add a WHERE statement
    if (category || maxPrice !== null) {
        selectSQL = selectSQL.concat(`WHERE `);

        // Add a category filter to the query, if a category was provided
        if (category) {
            selectSQL = selectSQL.concat(`category = ? `);
            queryParams.push(category);
        }

        if (category && maxPrice !== null) selectSQL = selectSQL.concat(`AND `);

        // Add a price filter to the query, if a max price was provided
        if (maxPrice !== null) {
            selectSQL = selectSQL.concat(`price <= ? `);
            queryParams.push(maxPrice);
        }
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL = selectSQL.concat(`HAVING title LIKE ? `);
        queryParams.push(`%${searchTerms}%`);
    }

    // sort the results so that newest listings are first, and set a maximum number of listings to return
    selectSQL = selectSQL.concat(`ORDER BY listing_id DESC
								  LIMIT ?;`);
    queryParams.push(maxListingsReturned);

    return database
        .query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numListings` most recently created listings and their attributes for the search recommendation.
 *
 * @param {int} numListings The number of listings to return.
 * @returns Returns an array containing the `numListings` most recently created listings. Can be an empty array,
 *     which indicates the listing table was empty.
 */
ListingModel.getNRecommendedListings = (numListings) => {
    /** Get a maximum of `numListings` listings sorted from newest to oldest. */
    const selectSQL = `SELECT listing_id, title, price, image_thumbnail_path
                       FROM listing
                       ORDER BY listing_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [numListings])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the listing_id, title, and price from the `numListings` most recently created listings.
 * 
 * @param {int} numListings The maximum number of listings to select from.
 * @returns On success, an array with the listing attributes. On error, -1.
 */
ListingModel.getNRecentListingIdTitlePrice = (numListings) => {
    const selectSQL = `SELECT listing_id, title, price
                       FROM listing
                       ORDER BY listing_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [numListings])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

/**
 * Finds the user's last `numListings` created listings, and selects the listing's id and title, as well as the type ("L").
 * 
 * @param {int} user_id The id of the user we are doing the search for.
 * @param {int} numListings The number of listings to return.
 * @returns On success, the array of listings. Otherwise, -1.
 */
ListingModel.getUserNRecentListingTitles = (user_id, numListings) => {
    const selectSQL = `SELECT l.listing_id, l.title, l.creation_date, "L" AS type
                       FROM listing l
                       INNER JOIN user u ON l.seller_id = u.user_id
                       WHERE u.user_id = ?
                       ORDER BY l.listing_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [user_id, numListings])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = ListingModel;
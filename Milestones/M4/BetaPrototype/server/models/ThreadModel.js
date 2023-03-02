const database = require("../config/dbConfig");
const ThreadModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Inserts a new thread into the database.
 * 
 * @param {string} title The title of the thread.
 * @param {string} category The category the thread belongs to.
 * @param {int} group_id The id of the group the thread belongs to. Can be null, which indicates it is a Gatormmunity thread.
 * @param {int} creator_id The id of the user who created the thread.
 * @returns On success, the new thread's thread_id. On failure, -1.
 */
ThreadModel.createThread = (title, category, group_id, creator_id) => {
    const insertSQL = `INSERT INTO thread (title, category, group_id, creator_id)
                       VALUES (?, ?, ?, ?);`;

    return database
        .query(insertSQL, [title, category, group_id, creator_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the thread's picture and thumbnail paths, if they exist.

 * @param {int} thread_id The id of the thread we are getting the picture paths of.
 * @returns If the thread has a picture, returns an object containing the thread's picture paths.
 *     If the thread has no picture, returns null. Otherwise, returns -1.
 */
ThreadModel.getThreadPicturePaths = (thread_id) => {
    /** Get the image path from the attachment associated with a thread's original post.
      * A thread's original post is the post that has the smallest post_id which has the thread's id as a foriegn key. */
    const selectQuery = `SELECT a.image_path, a.thumbnail_path
                         FROM attachment a
                         WHERE a.post_id = (SELECT p.post_id
                                            FROM thread t
                                            INNER JOIN post p ON t.thread_id = p.thread_id
                                            WHERE t.thread_id = ?
                                            ORDER BY post_id ASC
                                            LIMIT 1);`;

    return database
        .query(selectQuery, [thread_id])
        .then(([results]) => {
            if (results.length) return results[0];
            else if (results) return null;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the thread from the database.
  * On successful deletion, returns the deleted thread's id. Otherwise, returns -1. */
ThreadModel.deleteThread = (thread_id) => {
    const deleteQuery = `DELETE FROM thread
                         WHERE thread_id = ?;`;

    return database
        .query(deleteQuery, [thread_id])
        .then(([results]) => {
            if (results.affectedRows) return thread_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** 
 * Gets the thread's title and group_id given the thread's id.
 * 
 * @param {int} thread_id The id of the thread we are getting the title and group_id of.
 * @returns On success, the title and group_id. On error, -1.
 */
ThreadModel.getTitleAndGroup = (thread_id) => {
    const selectSQL = `SELECT title, group_id
                       FROM thread
                       WHERE thread_id = ?;`;

    return database
        .query(selectSQL, [thread_id])
        .then(([results]) => {
            // If the thread with the given thread_id doesn't exist, return -1.
            if (results.length) return results[0];
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Finds the user's last `numThreads` created Gatormmunity threads, and selects the thread's id, title, creation date,
 *     as well as the type ("T").
 * 
 * @param {int} user_id The id of the user we are doing the search for.
 * @param {int} numThreads The number of threads to return.
 * @returns On success, the array of created threads. Otherwise, -1.
 */
ThreadModel.getUserNGatorThreadTitles = (user_id, numThreads) => {
    const selectSQL = `SELECT t.thread_id, t.title, t.creation_date, "T" AS type
                       FROM thread t INNER JOIN user u
                       ON t.creator_id = u.user_id
                       WHERE u.user_id = ? AND t.group_id IS NULL
                       ORDER BY t.thread_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [user_id, numThreads])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets all the posts and their data (post data, user data, attachment data).
 * 
 * @param {int} thread_id The id of the thread we are trying to get all the posts of.
 * @returns On success, an array with all of the post data. On failure, -1.
 */
ThreadModel.getPosts = (thread_id) => {
    /** 
     * Get all the post data including user data and attachment data. The results will be ordered by their date, with the
     *     oldest posts being at the beginning of the array.
     * `post INNER JOIN user` because we want to get the user data associated with each post.
     * `LEFT OUTER JOIN attachment` because we want to keep all of our post data and only want to get the attachment data
     *     from the posts which have an attachment.
     */
    const selectSQL = `SELECT p.body, p.author_id, p.creation_date, u.profile_picture_thumbnail_path, p.is_original_post,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS author_name, a.filename, a.image_path, p.post_id,
                              a.thumbnail_path
                       FROM post p
                       INNER JOIN user u ON p.author_id = u.user_id
                       LEFT OUTER JOIN attachment a ON p.post_id = a.post_id
                       WHERE p.thread_id = ?
                       ORDER BY p.post_id ASC;`;

    return database
        .query(selectSQL, [thread_id])
        .then(([results]) => {
            if (results.length) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search the database for Gator or Group Forums threads that match the search terms and are of the desired category.
 *
 * @param {int} groupId The group to search for threads in. Can be null, to indicate we are looking for Gator Forums threads.
 * @param {string} searchTerms The search terms that will be used for the LIKE operator. Can be null,
 *     to indicate that the user wants to search for all threads.
 * @param {string} category The category to filter the matched threads with. Can be null,
 *     to indicate a lack of a category filter.
 * @param {int} maxThreadsReturned The maximum number of threads the functions will return.
 * @returns An array containing `maxThreadsReturned` most recently created threads who match the search terms
 *     and the category filter. Can be an empty array, to indicate a lack of matches.
 */
ThreadModel.searchThreads = (groupId, searchTerms, category, maxThreadsReturned) => {
    let queryParams = []; // params that will replace the question marks in the query

    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT t.thread_id, t.title, t.category, t.creation_date,
                            CONCAT_WS(' ', u.first_name, u.last_name) AS creator_name,
                            (SELECT COUNT(p.post_id)
                             FROM post p
                             WHERE t.thread_id = p.thread_id) AS num_posts
					 FROM thread t
                     INNER JOIN user u ON t.creator_id = u.user_id `;

    // Determines whether to show Gator or Group Forum threads
    if (groupId) {
        selectSQL = selectSQL.concat(`WHERE t.group_id = ? `);
        queryParams.push(groupId);
    } else {
        selectSQL = selectSQL.concat(`WHERE t.group_id IS NULL `);
    }

    // Add a category filter to the query, if a category was provided
    if (category) {
        selectSQL = selectSQL.concat(`AND t.category = ? `);
        queryParams.push(category);
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL = selectSQL.concat(`HAVING t.title LIKE ? `);
        queryParams.push(`%${searchTerms}%`);
    }

    // sort the results so that newest threads are first, and set a maximum number of threads to return
    selectSQL = selectSQL.concat(`ORDER BY t.thread_id DESC
								  LIMIT ?;`);
    queryParams.push(maxThreadsReturned);

    return database
        .query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numThreads` most recently created threads and their attributes for the search recommendation.
 *
 * @param {int} numThreads The number of threads to return.
 * @returns Returns an array containing the `numThreads` most recently created threads. Can be an empty array,
 *     which indicates the thread table was empty.
 */
ThreadModel.getNRecommendedGatorThreads = (numThreads) => {
    /** Get a maximum of `numThreads` threads sorted from newest to oldest. */
    const selectSQL = `SELECT t.thread_id, t.title, t.category, t.creation_date,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS creator_name,
                              (SELECT COUNT(p.post_id)
                               FROM post p
                               WHERE t.thread_id = p.thread_id) AS num_posts
					   FROM thread t
                       INNER JOIN user u ON t.creator_id = u.user_id
                       WHERE t.group_id IS NULL
                       ORDER BY t.thread_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [numThreads])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the thread_id and title from the `numThreads` most recently created threads.
 * 
 * @param {int} numThreads The maximum number of threads to select from.
 * @returns On success, an array with the thread attributes. On error, -1.
 */
ThreadModel.getNRecentIdsAndTitles = (numThreads) => {
    const selectSQL = `SELECT thread_id, title
                       FROM thread
                       WHERE group_id IS NULL
                       ORDER BY thread_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [numThreads])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

module.exports = ThreadModel;
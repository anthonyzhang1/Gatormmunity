/* This file contains all of the database queries related to the thread table. */

const database = require("../config/dbConfig");
const { ERROR, FORUM_THREAD_TYPE_CHAR, THREAD_LAST_POST_DATE_SORT, THREAD_CREATION_DATE_SORT } = require("../helpers/Constants");
const ThreadModel = {}; // all of the functions are stored here, which will then be exported

/**
 * Inserts a new thread into the database.
 * 
 * @param {string} title The title of the thread.
 * @param {string} category The category the thread belongs to.
 * @param {int} groupId The id of the group the thread belongs to. If null, then it is a Gatormmunity thread.
 * @param {int} creatorId The id of the user who created the thread.
 * @returns On successful creation, the new thread's id. Otherwise, ERROR.
 */
ThreadModel.createThread = (title, category, groupId, creatorId) => {
    const insertSQL = `INSERT INTO thread (title, category, group_id, creator_id)
                       VALUES (?, ?, ?, ?);`;

    return database.query(insertSQL, [title, category, groupId, creatorId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes the thread from the database.
 * 
 * @param {int} threadId The id of the thread to be deleted.
 * @returns On successful deletion, `threadId`. Otherwise, ERROR.
 */
ThreadModel.deleteThread = (threadId) => {
    const deleteSQL = `DELETE FROM thread
                       WHERE thread_id = ?;`;

    return database.query(deleteSQL, [threadId])
        .then(([results]) => {
            if (results.affectedRows) return threadId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the id and title from the `numThreads` most recently created Gatormmunity threads.
 * 
 * @param {int} numThreads The maximum number of threads to select from.
 * @returns An array with the threads, or ERROR on error.
 */
ThreadModel.getNRecentIdsAndTitles = (numThreads) => {
    const selectSQL = `SELECT thread_id, title
                       FROM thread
                       WHERE group_id IS NULL
                       ORDER BY thread_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [numThreads])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Get the `numThreads` most recently created threads.
 *
 * @param {int} numThreads The maximum number of threads to return.
 * @returns An array with the most recently created threads. The array can be empty, meaning there are no threads.
 */
ThreadModel.getNRecommendedGatorThreads = (numThreads) => {
    /** Get a maximum of `numThreads` threads sorted from newest to oldest. */
    const selectSQL = `SELECT t.thread_id, t.title, t.category, t.creation_date,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS creator_name,
                              (SELECT COUNT(*)
                               FROM post p
                               WHERE t.thread_id = p.thread_id) AS num_posts
					   FROM thread t
                       INNER JOIN user u ON t.creator_id = u.user_id
                       WHERE t.group_id IS NULL
                       ORDER BY t.thread_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [numThreads])
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets all the posts in a thread and their data (post data, user data, and attachment data).
 * 
 * @param {int} threadId The id of the thread we are trying to get the posts of.
 * @returns An array of posts, or ERROR on error.
 */
ThreadModel.getPosts = (threadId) => {
    /** Get all the post data including user data and attachment data. The results will be ordered by their creation date,
      *     with the oldest posts at the beginning.
      * We use `LEFT OUTER JOIN attachment` because we want to keep all of our post data and only want to get
      * the attachment data from the posts which have an attachment. */
    const selectSQL = `SELECT p.body, p.author_id, p.creation_date, u.profile_picture_thumbnail_path, p.is_original_post,
                              CONCAT_WS(' ', u.first_name, u.last_name) AS author_name, a.filename, a.image_path, p.post_id,
                              a.thumbnail_path
                       FROM post p
                       INNER JOIN user u ON p.author_id = u.user_id
                       LEFT OUTER JOIN attachment a ON p.post_id = a.post_id
                       WHERE p.thread_id = ?
                       ORDER BY p.post_id ASC;`;

    return database.query(selectSQL, [threadId])
        .then(([results]) => {
            if (results.length) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets the thread's picture and thumbnail paths, if they exist.
 *
 * @param {int} threadId The id of the thread we are getting the picture paths of.
 * @returns If the thread has pictures, returns an object with the thread's picture paths.
 *     If the thread has no pictures, returns `null`. Otherwise, returns ERROR.
 */
ThreadModel.getThreadPicturePaths = (threadId) => {
    /** Get the image path from the attachment associated with a thread's original post.
      * A thread's original post is the post that has the smallest post ID with the thread's ID as a foriegn key. */
    const selectSQL = `SELECT a.image_path, a.thumbnail_path
                       FROM attachment a
                       WHERE a.post_id = (SELECT MIN(p.post_id)
                                          FROM thread t
                                          INNER JOIN post p ON t.thread_id = p.thread_id
                                          WHERE t.thread_id = ?);`;

    return database.query(selectSQL, [threadId])
        .then(([results]) => {
            if (results?.length) return results[0];
            else if (results) return null;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Gets a thread's title and group ID.
 * 
 * @param {int} threadId The id of the thread.
 * @returns If the thread was found, the requested data. Otherwise, ERROR.
 */
ThreadModel.getTitleAndGroupId = (threadId) => {
    const selectSQL = `SELECT title, group_id
                       FROM thread
                       WHERE thread_id = ?;`;

    return database.query(selectSQL, [threadId])
        .then(([results]) => {
            if (results.length) return results[0];
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Finds the user's last `numThreads` created Gatormmunity Forum threads,
 * and gets their thread ID, title, creation date, and type (FORUM_THREAD_TYPE_CHAR).
 * 
 * @param {int} userId The id of the user we are doing the search for.
 * @param {int} numThreads The maximum number of threads to return.
 * @returns The array of threads, or ERROR on error.
 */
ThreadModel.getUserNLastGatorThreadsCreated = (userId, numThreads) => {
    const selectSQL = `SELECT t.thread_id, t.title, t.creation_date, ? AS type
                       FROM thread t
                       INNER JOIN user u ON t.creator_id = u.user_id
                       WHERE u.user_id = ? AND t.group_id IS NULL
                       ORDER BY t.thread_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [FORUM_THREAD_TYPE_CHAR, userId, numThreads])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Search for Gatormmunity or Group Forums threads that match the search terms and are of the desired category.
 *
 * @param {int} groupId The id of the group to search for threads in. If null, search for Gatormmunity Forum threads.
 * @param {string} searchTerms The search terms. If null, search for threads of any title.
 * @param {string} category The thread category to filter the matched threads with. If null, search for threads of any category.
 * @param {string} sortBy The setting in which to sort the matched threads: THREAD_LAST_POST_DATE_SORT,
 *     THREAD_CREATION_DATE_SORT, or THREAD_NUMBER_OF_POSTS_SORT.
 * @param {int} maxThreadsReturned The maximum number of threads to return.
 * @returns An array containing `maxThreadsReturned` most recently created threads that match the search terms and filters.
 *     Can be an empty array, indicating a lack of matches.
 */
ThreadModel.searchThreads = (groupId, searchTerms, category, sortBy, maxThreadsReturned) => {
    /** Contains the params for the prepared statement. */
    let queryParams = [];
    /** The query that we will append to based on whether certain parameters were provided. */
    let selectSQL = `SELECT t.thread_id, t.title, t.category, t.creation_date,
                            CONCAT_WS(' ', u.first_name, u.last_name) AS creator_name,
                            (SELECT COUNT(*)
                             FROM post p
                             WHERE t.thread_id = p.thread_id) AS num_posts,
                            (SELECT MAX(p.post_id)
                             FROM post p
                             WHERE t.thread_id = p.thread_id) AS last_post_id
					 FROM thread t
                     INNER JOIN user u ON t.creator_id = u.user_id `;

    // Determines whether to show Gatormmunity or Group Forum threads
    if (groupId) {
        selectSQL += 'WHERE t.group_id = ? ';
        queryParams.push(groupId);
    } else {
        selectSQL += 'WHERE t.group_id IS NULL ';
    }

    // Add a category filter to the query, if a category was provided
    if (category) {
        selectSQL += 'AND t.category = ? ';
        queryParams.push(category);
    }

    // Add searchTerms to the query, if search terms were provided
    if (searchTerms) {
        selectSQL += 'HAVING t.title LIKE ? ';
        queryParams.push(`%${searchTerms}%`);
    }

    /* Sort the threads by whichever sort option was provided, and set the maximum number of threads to return. */
    if (sortBy === THREAD_LAST_POST_DATE_SORT) { // sort by last post date, i.e. threads with the most recent posts are first
        selectSQL += `ORDER BY last_post_id DESC
                      LIMIT ?;`;
    } else if (sortBy === THREAD_CREATION_DATE_SORT) { // sort by creation date, i.e. newest threads are first
        selectSQL += `ORDER BY t.thread_id DESC
                      LIMIT ?;`;
    } else { // sort by number of posts, i.e. threads with the most posts are first
        selectSQL += `ORDER BY num_posts DESC
                      LIMIT ?;`;
    }

    queryParams.push(maxThreadsReturned); // for the LIMIT parameter

    return database.query(selectSQL, queryParams)
        .then(([results]) => { return results })
        .catch((err) => Promise.reject(err));
};

module.exports = ThreadModel;
/* This file contains constant variables that are shared between the back end.
 * We do this to minimize magic numbers in our code. */

const path = require("path");

/** Only these listing categories are allowed. */
exports.LISTING_CATEGORIES = [
    "Apparel", "Books", "Electronics", "Entertainment", "Miscellaneous", "Perishables", "Services"
];

/** Only these thread categories are allowed. */
exports.THREAD_CATEGORIES = ["Discussion", "General", "Help", "Off-Topic", "Promotion", "Social"];
/** Used to sort threads by their last post date. */
exports.THREAD_LAST_POST_DATE_SORT = "Last Post Date";
/** Used to sort threads by their creation date. */
exports.THREAD_CREATION_DATE_SORT = "Creation Date";
/** Used to sort threads by their number of posts. */
exports.THREAD_NUMBER_OF_POSTS_SORT = "Number of Posts";

/** The path of the default user profile picture that we use. */
exports.DEFAULT_PHOTO_PATH = path.join("public", "profile_pictures", "defaultPhoto.png");
/** The path of the default user profile picture thumbnail that we use. */
exports.DEFAULT_PHOTO_THUMBNAIL_PATH = path.join("public", "profile_pictures", "tn-defaultPhoto.png");

/** The roles a user can have. */
exports.USER_ROLES = [
    { value: 0, description: "Unapproved User" },
    { value: 1, description: "Approved User" },
    { value: 2, description: "Moderator" },
    { value: 3, description: "Administrator" }
];

/** The roles a group user can have. */
exports.GROUP_ROLES = [
    { value: 1, description: "Member" },
    { value: 2, description: "Moderator" },
    { value: 3, description: "Administrator" }
];

/** The role value of a Gatormmunity unapproved user stored in the database. */
exports.UNAPPROVED_USER_ROLE = 0;
/** The role value of a Gatormmunity approved user stored in the database. */
exports.APPROVED_USER_ROLE = 1;
/** The role value of a Gatormmunity moderator stored in the database. */
exports.MODERATOR_ROLE = 2;
/** The role value of a Gatormmunity administrator stored in the database. */
exports.ADMINISTRATOR_ROLE = 3;

/** The role value of a group member stored in the database. */
exports.GROUP_MEMBER_ROLE = 1;
/** The role value of a group moderator stored in the database. */
exports.GROUP_MODERATOR_ROLE = 2;
/** The role value of a group administrator stored in the database. */
exports.GROUP_ADMINISTRATOR_ROLE = 3;

/** The id of the hardcoded Gator Chat in the front end. */
exports.GATOR_CHAT_ID = 0;

/** The char which represents a forum thread. Used for the user profile activity log. */
exports.FORUM_THREAD_TYPE_CHAR = 'T';
/** The char which represents a forum post. Used for the user profile activity log. */
exports.FORUM_POST_TYPE_CHAR = 'P';
/** The char which represents a listing. Used for the user profile activity log. */
exports.LISTING_TYPE_CHAR = 'L';

/** Returned from the model functions indicating an error has occurred. */
exports.ERROR = -1;
/** Used by controllers to break out of a .then() promise chain early. */
exports.SKIP = "SKIP";

/** Used to tell the front end of a successful action. */
exports.SUCCESS_STATUS = "success";
/** Used to indicate a failed action, but the front end should not display an error/alert message,
  * and should instead inform the user of the error to let them try again. */
exports.INFO_STATUS = "info";
/** Used to tell the front end of a failed action. */
exports.ERROR_STATUS = "error";

/** Regex for the currency inputs we take, such as price and max price.
  * It allows for non-negative decimal values with 1-2 decimal places. */
exports.VALID_CURRENCY_REGEX = /^(\d*)(\.\d{1,2})?$/;
/** Only files of these types can be uploaded. */
exports.ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
/** Only files within this max file size can be uploaded. In this case, 5 MB in bytes. */
exports.MAX_FILE_SIZE = 5242880;
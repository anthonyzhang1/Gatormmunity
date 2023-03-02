/** Used to tell the front end of a successful action. */
exports.SUCCESS_STATUS = "success";

/** Used to tell the front end of a failed action. */
exports.ERROR_STATUS = "error";

/** Only files of these types can be uploaded. */
exports.ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/** Only files within this max file size can be uploaded. In this case, 5 MB in bytes. */
exports.MAX_FILE_SIZE = 5242880;

/** The roles a user can have. */
exports.USER_ROLES = [
	{ value: 0, description: "Unapproved User" },
	{ value: 1, description: "Approved User" },
	{ value: 2, description: "Moderator" },
	{ value: 3, description: "Administrator" }
];

/** The roles a group user can have in a group. */
exports.GROUP_ROLES = [
	{ value: 1, description: "Member" },
	{ value: 2, description: "Moderator" },
	{ value: 3, description: "Administrator" }
];

/** Only these listing categories are allowed. */
exports.LISTING_CATEGORIES = ["Miscellaneous", "Educational", "Electronics", "Entertainment", "Services"];

/** Only these thread categories are allowed. */
exports.THREAD_CATEGORIES = ["General", "Social", "Questions"];

/** Regex for the currency inputs we take, such as price and max price.
  * It allows for non-negative decimal values with 1-2 decimal places. */
exports.VALID_CURRENCY_REGEX = /^(\d*)(\.\d{1,2})?$/;
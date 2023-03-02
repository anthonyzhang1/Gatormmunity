/* File for housing constants that are shared between the front end. */

/** A generic category that refers to all categories used when searching or filtering. */
export const ANY_CATEGORY = "Any";

/** The options for a thread's category. */
export const THREAD_CATEGORIES = ["General", "Social", "Questions"];

/** The options for a listing's category. */
export const LISTING_CATEGORIES = ["Miscellaneous", "Educational", "Electronics", "Entertainment", "Services"];

/** The roles a user can have. This is used for dropdowns, .map(), and .filter(). */
export const USER_ROLES = [
	{ value: 0, description: "Unapproved User" },
	{ value: 1, description: "Approved User" },
	{ value: 2, description: "Moderator" },
	{ value: 3, description: "Administrator" }
];

/** The role value of a Gatormmunity unapproved user that is stored in the database. */
export const UNAPPROVED_USER_ROLE = 0;
/** The role value of a Gatormmunity approved user that is stored in the database. */
export const APPROVED_USER_ROLE = 1;
/** The role value of a Gatormmunity moderator that is stored in the database. */
export const MODERATOR_ROLE = 2;
/** The role value of a Gatormmunity administrator that is stored in the database. */
export const ADMINISTRATOR_ROLE = 3;

/** The roles a group user can have in a group. This is used for dropdowns, .map(), and .filter(). */
export const GROUP_ROLES = [
	{ value: 1, description: "Member" },
	{ value: 2, description: "Moderator" },
	{ value: 3, description: "Administrator" }
];

/** The role value of a group member that is stored in the database. */
export const GROUP_MEMBER_ROLE = 1;
/** The role value of a group moderator that is stored in the database. */
export const GROUP_MODERATOR_ROLE = 2;
/** The role value of a group administrator that is stored in the database. */
export const GROUP_ADMINISTRATOR_ROLE = 3;

/** Gator Chat is hardcoded because everyone can see Gator Chat in their chats. */
export const GATOR_CHAT = {
	id: 0,
	name: "Gator Chat",
	picture: "images/assets/gatorFrontLogo.png"
}

/** Used by the back end to indicate a successful action. */
export const SUCCESS_STATUS = "success";

/** Used by the back end to indicate a failed action. */
export const ERROR_STATUS = "error";

/** Warns the user that they are being redirected to an external site. */
export function RedirectionWarning() {
    alert("Caution! You are about to visit an external website not affiliated with Gatormmunity!");
}
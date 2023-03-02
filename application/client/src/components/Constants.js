/* This file contains constant variables and functions that are shared between the front end.
 * We do this to minimize magic numbers in our code. */

/** A generic category that refers to all categories used when searching or filtering. */
export const ANY_CATEGORY = "Any";
/** The options for a listing's category. */
export const LISTING_CATEGORIES = [
    "Apparel", "Books", "Electronics", "Entertainment", "Miscellaneous", "Perishables", "Services"
];

/** The options for a thread's category. */
export const THREAD_CATEGORIES = ["Discussion", "General", "Help", "Off-Topic", "Promotion", "Social"];
/** The options for sorting the threads on the forums page. */
export const THREAD_SORT_OPTIONS = ["Last Post Date", "Creation Date", "Number of Posts"];

/** The roles a user can have. This is used for dropdowns, .map(), and .filter(). */
export const USER_ROLES = [
    { value: 0, description: "Unapproved User" },
    { value: 1, description: "Approved User" },
    { value: 2, description: "Moderator" },
    { value: 3, description: "Administrator" }
];

/** The roles a group user can have in a group. This is used for dropdowns, .map(), and .filter(). */
export const GROUP_ROLES = [
    { value: 1, description: "Member" },
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

/** The role value of a group member that is stored in the database. */
export const GROUP_MEMBER_ROLE = 1;
/** The role value of a group moderator that is stored in the database. */
export const GROUP_MODERATOR_ROLE = 2;
/** The role value of a group administrator that is stored in the database. */
export const GROUP_ADMINISTRATOR_ROLE = 3;

/** The char which represents a forum thread activity sent by the back end. */
export const FORUM_THREAD_ACTIVITY_TYPE = 'T';
/** The char which represents a forum post activity sent by the back end. */
export const FORUM_POST_ACTIVITY_TYPE = 'P';
/** The char which represents a listing activity sent by the back end. */
export const LISTING_ACTIVITY_TYPE = 'L';

/** One of the possible activities for the user's recent activities. In this case, a thread was created. */
export const FORUM_THREAD_ACTIVITY = "thread";
/** One of the possible activities for the user's recent activities. In this case, a post was created in a thread. */
export const FORUM_POST_ACTIVITY = "post in";
/** One of the possible activities for the user's recent activities. In this case, a listing was created. */
export const LISTING_ACTIVITY = "listing";

/** Gator Chat is hardcoded because everyone can see Gator Chat in their chats. */
export const GATOR_CHAT = {
    id: 0,
    name: "Gator Chat",
    picture: "images/assets/gatorFrontLogo.png"
}

/** Used to align a chat or direct message on the left. Messages are left-aligned if the user is not the sender. */
export const MESSAGE_LEFT_ALIGNMENT = 'L';
/** Used to align a chat or direct message on the right. Messages are right-aligned if the user is the sender. */
export const MESSAGE_RIGHT_ALIGNMENT = 'R';

/** How many milliseconds to wait to update the chat message or direct message log. 1000 ms = 1 sec */
export const REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS = 1000;

/** Used by React to detect whether the Enter key was pressed. */
export const ENTER_KEY = "Enter";

/** Used by the back end to indicate a successful action. */
export const SUCCESS_STATUS = "success";
/** Used by the back end to indicate a failed action, but the front end should not display an error/alert message,
  * and should instead inform the user of the error to let them try again. */
export const INFO_STATUS = "info";
/** Used by the back end to indicate a failed action. */
export const ERROR_STATUS = "error";

/** Warns the user that they are being redirected to an external site. */
export function RedirectionWarning() {
    alert("Caution! You are about to visit an external website not affiliated with Gatormmunity!");
}
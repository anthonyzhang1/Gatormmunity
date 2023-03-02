/* This file holds the functions which map categories/roles/etc. to a dropdown.
 * These dropdowns are shown on the Search, Forums, and Marketplace pages, for example. */

import { ANY_CATEGORY, USER_ROLES } from "./Constants";
import { LISTING_CATEGORIES, THREAD_CATEGORIES } from "./Constants";

/** Maps the valid user roles to options for a dropdown. */
export function getRoleFilterOptions() {
    let options = USER_ROLES.map((role) => {
        return <option key={role.value} value={role.value}>{role.description}</option>;
    });

    // prepend the `ANY_CATEGORY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}

/** 
 * Gets the title of a user role based on what was selected in a dropdown, e.g. "2" would return "Moderator".
 * The function handles the case where the user selects the `ANY_CATEGORY` category.
 * 
 * @param {string} value The role's value, e.g. "1", "2", or `ANY_CATEGORY`.
 * @returns `ANY_CATEGORY`, or the description of the role based on the value provided.
 */
export function getRoleDescription(value) {
    if (value === ANY_CATEGORY) return ANY_CATEGORY; // not a user role, but it is a dropdown option so we must handle it
    else return USER_ROLES.find(role => role.value === parseInt(value)).description;
}

/** Maps the valid listing categories to options for a dropdown. */
export function getListingCategoryFilterOptions() {
    let options = LISTING_CATEGORIES.map((category, index) => {
        return <option key={index} value={category}>{category}</option>;
    });

    // prepend the `ANY_CATEGORY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}

/** Maps the valid thread categories to options for a dropdown. */
export function getThreadCategoryFilterOptions() {
    let options = THREAD_CATEGORIES.map((category, index) => {
        return <option key={index} value={category}>{category}</option>;
    });

    // prepend the `ANY_CATEGORY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}
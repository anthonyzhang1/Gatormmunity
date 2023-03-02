import { ANY_CATEGORY, USER_ROLES } from "../Constants";
import { LISTING_CATEGORIES, THREAD_CATEGORIES } from "../Constants";

export function getRoleFilterOptions() {
    let options = USER_ROLES.map((role) => {
        return <option key={role.value} value={role.value}>{role.description}</option>;
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}

export function getRoleDescription(value) {
    if (value === ANY_CATEGORY) return ANY_CATEGORY;
    else return USER_ROLES.find(role => role.value === parseInt(value)).description;
}

export function getListingCategoryFilterOptions() {
    let options = LISTING_CATEGORIES.map((category, index) => {
        return <option key={index} value={category}>{category}</option>;
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}

export function getThreadCategoryFilterOptions() {
    let options = THREAD_CATEGORIES.map((category, index) => {
        return <option key={index} value={category}>{category}</option>;
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY_CATEGORY} value={ANY_CATEGORY}>{ANY_CATEGORY}</option>);
    return options;
}
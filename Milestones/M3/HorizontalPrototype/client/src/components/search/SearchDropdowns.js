import { userRoles, listingCategories, threadCategories } from "../M3MockData";

const ANY = "Any";

export function getRoleFilterOptions() {
    let options = userRoles.map((role) => {
        return (
            <option key={role.value} value={role.value}>{role.description}</option>
        );
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY} value={ANY}>{ANY}</option>);

    return options;
}

export function getRoleDescription(value) {
    if (value === ANY) return ANY;
    else return userRoles.find(role => role.value === value.toString()).description;
}

export function getListingCategoryFilterOptions() {
    let options = listingCategories.map((category, index) => {
        return (
            <option key={index} value={category}>{category}</option>
        );
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY} value={ANY}>{ANY}</option>);

    return options;
}

export function getThreadCategoryFilterOptions() {
    let options = threadCategories.map((category, index) => {
        return (
            <option key={index} value={category}>{category}</option>
        );
    });

    // prepend the `ANY` option to the top of the dropdown
    options.unshift(<option key={ANY} value={ANY}>{ANY}</option>);

    return options;
}
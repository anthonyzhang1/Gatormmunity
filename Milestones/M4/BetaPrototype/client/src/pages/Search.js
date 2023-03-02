/* This file handles the display of the Search page. We receive the search terms from the navbar component, and we search for
 * users first. The user can specify what they want to search for with the side bar, and narrow the search results down with the
 * search filters, e.g. role or category. */

import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { UserContext } from '../App.js';
import { ANY_CATEGORY, ERROR_STATUS } from "../components/Constants.js";
import ListingCard from "../components/ListingCard";
import UserRow from '../components/search/SearchResultUser';
import ForumThreadRow from "../components/forums/ForumThread";
import {
    getRoleDescription, getRoleFilterOptions,
    getListingCategoryFilterOptions, getThreadCategoryFilterOptions
} from "../components/search/SearchDropdowns";

export default function Search() {
    const ERROR = -1; // used for when an error occurred in the search
    const LOADING = 0; // used for when our search is loading
    const USERS = 1; // used for when the search is currently showing users
    const LISTINGS = 2; // used for when the search is currently showing listings
    const THREADS = 3; // used for when the search is currently showing threads

    const userSession = useContext(UserContext); // the user's session data
    const { searchTerms } = useParams(); // retrieved from the URL

    /* The states for the filters. */
    const [roleFilter, setRoleFilter] = useState(ANY_CATEGORY); // user search
    const [listingCategoryFilter, setListingCategoryFilter] = useState(ANY_CATEGORY); // listing search
    const [maxPriceFilter, setMaxPriceFilter] = useState(""); // listing search
    const [threadCategoryFilter, setThreadCategoryFilter] = useState(ANY_CATEGORY); // thread search

    const [returnData, setReturnData] = useState(null); // stores the data being shown
    const [currentlyShowing, setCurrentlyShowing] = useState({ type: USERS, dropdownFilter: ANY_CATEGORY });

    /** 
     * Send the search terms and the role filter to the back end so it can search the database.
     * @param {event} e Can be null.
     * 
     * The front end sends:
     * searchTerms: {string} The search terms the user entered. Can be null, which means search for users with any name.
     * role: {string} The role the user wants to filter by. Can be `null`, '0', '1', '2', or '3'.
     *     A null role means search for users with any role.
     */
    function searchUsers(e) {
        e?.preventDefault(); // stops the page from refreshing after filtering
        setCurrentlyShowing({ type: LOADING, dropdownFilter: currentlyShowing.dropdownFilter }); // set loading message

        fetch('/api/users/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerms: searchTerms,
                role: roleFilter === ANY_CATEGORY ? null : roleFilter
            })
        })
            .then(res => res.json())
            .then(data => {
                setCurrentlyShowing({ type: USERS, dropdownFilter: getRoleDescription(roleFilter) });
                setReturnData(data);
            })
            .catch(console.log());
    }

    /** 
     * Send the search terms, and the category and max price filter to the back end so it can search the database.
     * @param {event} e Can be null.
     * 
     * The front end sends:
     * searchTerms: {string} The search terms the user entered. Can be null, which means search for listings with any title.
     * category: {string} The listing category to filter by. Can be null, which means search for listings in all categories.
     * maxPrice: {string} The maximum price to filter by. Can be null, which means search for listings of any price.
     */
    function searchListings(e) {
        e?.preventDefault(); // stops the page from refreshing after filtering
        setCurrentlyShowing({ type: LOADING, dropdownFilter: currentlyShowing.dropdownFilter }); // set loading message

        fetch('/api/listings/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerms: searchTerms,
                category: listingCategoryFilter === ANY_CATEGORY ? null : listingCategoryFilter,
                maxPrice: maxPriceFilter === '' ? null : maxPriceFilter
            })
        })
            .then(res => res.json())
            .then(data => {
                setCurrentlyShowing({ type: LISTINGS, dropdownFilter: listingCategoryFilter, maxPriceFilter: maxPriceFilter });
                setReturnData(data);
            })
            .catch(console.log());
    }

    /** 
     * Send the search terms and the category filter to the back end so it can search the database.
     * @param {event} e Can be null.
     * 
     * The front end sends:
     * searchTerms: {string} The search terms the user entered. Can be null, which means search for threads with any title.
     * category: {string} The category the user wants to filter by. Can be null,
     *     which means search for threads in all categories.
     */
    function searchThreads(e) {
        e?.preventDefault(); // stops the page from refreshing after filtering
        setCurrentlyShowing({ type: LOADING, dropdownFilter: currentlyShowing.dropdownFilter }); // set loading message

        fetch('/api/threads/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerms: searchTerms,
                category: threadCategoryFilter === ANY_CATEGORY ? null : threadCategoryFilter
            })
        })
            .then(res => res.json())
            .then(data => {
                setCurrentlyShowing({ type: THREADS, dropdownFilter: threadCategoryFilter });
                setReturnData(data);
            })
            .catch(console.log());
    }

    /** Gets the message describing what the user searched for and how many matches there were. */
    function getSearchResultsTitle() {
        let title = ''; // the message that will be returned and displayed for the search results title

        switch (currentlyShowing.type) {
            case ERROR:
                return returnData?.message;
            case LOADING:
                return 'Searching...';
            case USERS:
                if (currentlyShowing.dropdownFilter === ANY_CATEGORY) title += 'Searched All Users'; // category
                else title += `Searched ${currentlyShowing.dropdownFilter}s`;

                if (searchTerms) title += ` with "${searchTerms}"`; // search terms

                return `${title}: ${returnData?.numUsersMatched} found.`; // number of matches
            case LISTINGS:
                if (currentlyShowing.dropdownFilter === ANY_CATEGORY) title += 'Searched All Listings'; // category
                else title += `Searched ${currentlyShowing.dropdownFilter} Listings`;

                if (searchTerms) title += ` with "${searchTerms}"`; // search terms
                if (currentlyShowing.maxPriceFilter.length) title += ` within $${currentlyShowing.maxPriceFilter}`; // max price

                return `${title}: ${returnData?.numListingsMatched} found.`; // number of matches
            case THREADS:
                if (currentlyShowing.dropdownFilter === ANY_CATEGORY) title += 'Searched All Threads'; // category
                else title += `Searched ${currentlyShowing.dropdownFilter} Threads`;

                if (searchTerms) title += ` with "${searchTerms}"`; // search terms

                return `${title}: ${returnData?.numThreadsMatched} found.`; // number of matches
            default:
                return "An error occurred.";
        }
    }

    /** Display an info (not error) message which explains any unexpected search results. */
    function displayInfoMessage() {
        if (returnData.users?.length === 0) { // if the search returned 0 users as a result of an empty table
            return <h3 className="search-message">No users have registered. Therefore, there are no users to show.</h3>;
        } else if (returnData.listings?.length === 0) { // if the search returned 0 listings as a result of an empty table
            return <h3 className="search-message">No listings have been made. Therefore, there are no listings to show.</h3>;
        } else if (returnData.threads?.length === 0) { // if the search returned 0 threads as a result of an empty empty
            return <h3 className="search-message">No threads have been made. Therefore, there are no threads to show.</h3>;
        } else if (returnData.numUsersMatched === 0) { // if the search matched 0 users
            return (
                <h3 className="search-message">
                    No users matched your search terms, so here are a few of our newest members instead!
                </h3>
            );
        } else if (returnData.numListingsMatched === 0) { // if the search matched 0 listings
            return (
                <h3 className="search-message">
                    No listings matched your search terms, so here are a few of our newest listings instead!
                </h3>
            );
        } else if (returnData.numThreadsMatched === 0) { // if the search matched 0 threads
            return (
                <h3 className="search-message">
                    No threads matched your search terms, so here are a few of our newest threads instead!
                </h3>
            );
        }
    }

    /** Maps all of the users in the search result to a new UserRow component. */
    function displayUserRows() {
        return returnData.users?.map((user) => {
            return (
                <UserRow key={user.user_id} thumbnail={user.profile_picture_thumbnail_path} fullName={user.full_name}
                    role={user.role} userId={user.user_id}
                />
            );
        });
    }

    /** Maps all of the listings in the search result to a new ListingCard component. */
    function displayListings() {
        return returnData.listings?.map((listing) => {
            return (
                <Col className="d-flex align-items-stretch" key={listing.listing_id}>
                    <ListingCard listing_id={listing.listing_id} name={listing.title} price={listing.price}
                        picture={listing.image_thumbnail_path}
                    />
                </Col>
            );
        });
    }

    /** Maps all of the threads in the search result to a new ThreadRow component. */
    function displayThreads() {
        return returnData.threads?.map((thread) => {
            return (
                <ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} creatorName={thread.creator_name}
                    title={thread.title} date={thread.creation_date} numPosts={thread.num_posts}
                />
            );
        });
    }

    /* Call the search users function the first time this page is navigated to. */
    useEffect(() => searchUsers(), []); // eslint-disable-line react-hooks/exhaustive-deps

    /* Searches in the same category but with different search terms. */
    useEffect(() => {
        switch (currentlyShowing.type) {
            case USERS:
                searchUsers();
                break;
            case LISTINGS:
                searchListings();
                break;
            case THREADS:
                searchThreads();
                break;
            default:
                alert("An error occurred with your search.");
        }
    }, [searchTerms]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Show the error in the search results if the search failed. */
    useEffect(() => {
        if (returnData?.status === ERROR_STATUS) {
            setCurrentlyShowing({ type: ERROR, dropdownFilter: currentlyShowing.dropdownFilter });
        }
    }, [returnData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!returnData) return; // wait for fetch
    else return (
        <div className="search-page">
            <Container className="search-container" fluid>
                <Row>
                    <Col className="search-filters-col" md="auto">
                        <h3 className="filters-header">Search Filters</h3>

                        <Form className="search-users-form" onSubmit={searchUsers}>
                            {/* Role Dropdown Filter */}
                            <Form.Group className="dropdown-filter mb-3" controlId="search-role-filter">
                                <Form.Label>Role</Form.Label>
                                <Form.Select onChange={e => setRoleFilter(e.target.value)}>
                                    {getRoleFilterOptions()}
                                </Form.Select>
                            </Form.Group>

                            {/* Apply the filters when pressing the search button */}
                            <Button className="search-button search-users-button default-button-color" type="submit">
                                Search Users
                            </Button>
                        </Form>

                        {/* Must be logged in to search for listings. */}
                        {userSession.isLoggedIn && <Form className="search-listings-form" onSubmit={searchListings}>
                            {/* Listing Category Dropdown Filter */}
                            <Form.Group className="dropdown-filter mb-3" controlId="search-listing-filter">
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={e => setListingCategoryFilter(e.target.value)}>
                                    {getListingCategoryFilterOptions()}
                                </Form.Select>
                            </Form.Group>

                            {/* Max Price Filter */}
                            <Form.Group className="mb-3" controlId="search-max-price">
                                <Form.Label>Max Price (USD)</Form.Label>
                                <Form.Control className="max-price" type='number' step="0.01" placeholder='None'
                                    onChange={e => setMaxPriceFilter(e.target.value)}
                                />
                            </Form.Group>

                            {/* Apply the filters when pressing the search button */}
                            <Button className="search-button search-listings-button default-button-color" type="submit">
                                Search Listings
                            </Button>
                        </Form>}

                        {/* Must be logged in to search for threads. */}
                        {userSession.isLoggedIn && <Form className="search-threads-form" onSubmit={searchThreads}>
                            {/* Thread Category Dropdown Filter */}
                            <Form.Group className="dropdown-filter mb-3" controlId="search-threads-filter">
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={e => setThreadCategoryFilter(e.target.value)}>
                                    {getThreadCategoryFilterOptions()}
                                </Form.Select>
                            </Form.Group>

                            {/* Apply the filters when pressing the search button. */}
                            <Button className="search-button search-threads-button default-button-color" type="submit">
                                Search Threads
                            </Button>
                        </Form>}
                    </Col>

                    <Col className="results-col">
                        <h2 className="results-header">{getSearchResultsTitle()}</h2>

                        {/* Display the users search results. */}
                        {currentlyShowing.type === USERS && <>
                            {displayInfoMessage()}
                            {displayUserRows()}
                        </>}

                        {/* Display the listings search results. */}
                        {currentlyShowing.type === LISTINGS && <>
                            {displayInfoMessage()}
                            <Row className="listings" md="auto">
                                {displayListings()}
                            </Row>
                        </>}

                        {/* Display the threads search results. */}
                        {currentlyShowing.type === THREADS && <>
                            {displayInfoMessage()}
                            {displayThreads()}
                        </>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
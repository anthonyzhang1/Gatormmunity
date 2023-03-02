import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { UserContext } from '../App.js';
import { mockListings, mockThreads, mockUsers } from '../components/M3MockData';
import ListingCard from "../components/ListingCard";
import UserRow from '../components/search/SearchResultUser';
import ForumThreadRow from "../components/forums/ForumThread";
import {
    getRoleDescription, getRoleFilterOptions,
    getListingCategoryFilterOptions, getThreadCategoryFilterOptions
} from "../components/search/SearchDropdowns";

export default function Search() {
    /** The default values for all of our dropdowns. */
    const ANY = "Any";
    const USERS = 0; // used for when the search is currently showing users
    const LISTINGS = 1; // used for when the search is currently showing listings
    const THREADS = 2; // used for when the search is currently showing threads

    const userSession = useContext(UserContext); // the user's session data
    const { state } = useLocation();
    const { userSearchResult, searchTerms } = state || {};

    /* The states for the filters. */
    const [roleFilter, setRoleFilter] = useState(ANY); // user search
    const [listingCategoryFilter, setListingCategoryFilter] = useState(ANY); // listing search
    const [maxPriceFilter, setMaxPriceFilter] = useState(""); // listing search
    const [threadCategoryFilter, setThreadCategoryFilter] = useState(ANY); // thread search

    const [returnData, setReturnData] = useState([]); // stores the data being shown
    const [currentlyShowing, setCurrentlyShowing] = useState({
        type: USERS,
        dropdownFilter: ANY
    });

    /** Applies the filters to the users and search the listings. */
    function searchUsers(e) {
        e.preventDefault(); // stops the page from refreshing after filtering
        const role = roleFilter === ANY ? "" : roleFilter; // the role to filter by in the back end

        fetch('/api/users/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerms: searchTerms,
                role: role
            })
        })
            .then(res => res.json())
            .then(data => {
                setCurrentlyShowing({ type: USERS, dropdownFilter: getRoleDescription(roleFilter) });
                setReturnData(data);
            })
            .catch(console.log());
    }

    /** Applies the filters to the listings and search the listings. */
    function searchListings(e) {
        e.preventDefault(); // stops the page from refreshing after filtering

        let listings = mockListings; // start with all of the listings

        // only listings that are of the correct category are left in `listings`
        if (listingCategoryFilter !== ANY) {
            listings = listings.filter((listing) => listing.category === listingCategoryFilter);
        }

        // only listings that are within the max price range are left in `listings`
        if (maxPriceFilter.length > 0) {
            listings = listings.filter((listing) => parseFloat(listing.price) <= parseFloat(maxPriceFilter));
        }

        setCurrentlyShowing({ type: LISTINGS, dropdownFilter: listingCategoryFilter });
        setReturnData(listings);
    }

    /** Applies the filters to the threads and search the threads. */
    function searchThreads(e) {
        e.preventDefault(); // stops the page from refreshing after filtering

        // only show threads that do not belong to the public gatormmunity forums
        let threads = mockThreads.filter((thread) => thread.group_id === null).reverse();

        // only threads that are of the correct category are left in `threads`
        if (threadCategoryFilter !== ANY) {
            threads = threads.filter((thread) => thread.category === threadCategoryFilter);
        }

        setCurrentlyShowing({ type: THREADS, dropdownFilter: threadCategoryFilter });
        setReturnData(threads);
    }

    function displaySearchResultsTitle() {
        switch (currentlyShowing.type) {
            case USERS:
                return `Searched Users in [${currentlyShowing.dropdownFilter}] for "${searchTerms}":
                        ${returnData?.numUsersMatched} user(s) matched.`;
            case LISTINGS:
                return `Searched Listings in [${currentlyShowing.dropdownFilter}]: ${returnData?.length} listing(s) matched.`;
            case THREADS:
                return `Searched Threads in [${currentlyShowing.dropdownFilter}]: ${returnData?.length} thread(s) matched.`;
            default:
                return "An error occurred.";
        }
    }

    function displayMessage() {
        if (returnData?.users?.length === 0) { // if the search returned 0 users as a result of an empty database
            return (
                <h4 className="search-message">
                    No users have registered. Therefore, there are no users to show.
                </h4>
            );
        } else if (returnData?.numUsersMatched === 0) { // if the search matched 0 users
            return (
                <h4 className="search-message">
                    No users matched your search terms, so here are a few of our newest members instead!
                </h4>
            );
        }
    }

    /** Maps all of the users in the search result to a new UserRow component. */
    function displayUserRows() {
        return returnData?.users?.map((user, index) => {
            return (
                <UserRow key={index} thumbnail={user.profile_picture_thumbnail_path}
                    fullName={user.full_name} role={user.role}
                />
            );
        });
    }

    /** Maps all of the listings in the search result to a new ListingCard component. */
    function displayListings() {
        return returnData?.map((listing) => {
            return (
                <Col className="d-flex align-items-stretch" key={listing.listing_id}>
                    <ListingCard listing_id={listing.listing_id} name={listing.name} price={listing.price}
                        picture={listing.picture}
                    />
                </Col>
            );
        });
    }

    /** Maps all of the threads in the search result to a new ThreadRow component. */
    function displayThreads() {
        return returnData?.map((thread) => {
            // Get the name of the author given the author's id.
            const author = mockUsers.find(user => user.user_id === thread.author_id).full_name;

            return (
                <ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} author={author} title={thread.title}
                    date={thread.date} numPosts={thread.num_posts} category={thread.category}
                />
            );
        });
    }

    /* Use the user search results sent from the navbar component */
    useEffect(() => {
        setReturnData(userSearchResult);
        setCurrentlyShowing({ type: USERS, dropdownFilter: ANY });
    }, [userSearchResult]);

    /* Alert the user if the search failed. */
    useEffect(() => {
        if (returnData?.status === 'error') { // alert on search error
            alert(returnData.message);
        }
    }, [returnData]);

    if (!state) {
        return <h2 className='page-title'>Sorry, an error occurred! Please try searching again using the search bar.</h2>
    } else return (
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
                        {userSession && <Form className="search-listings-form" onSubmit={searchListings}>
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
                        {userSession && <Form className="search-threads-form" onSubmit={searchThreads}>
                            {/* Thread Category Dropdown Filter */}
                            <Form.Group className="dropdown-filter mb-3" controlId="search-threads-filter">
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={e => setThreadCategoryFilter(e.target.value)}>
                                    {getThreadCategoryFilterOptions()}
                                </Form.Select>
                            </Form.Group>

                            {/* Apply the filters when pressing the search button */}
                            <Button className="search-button search-threads-button default-button-color" type="submit">
                                Search Threads
                            </Button>
                        </Form>}

                    </Col>

                    <Col className="results-col">
                        <h2 className="results-header">{displaySearchResultsTitle()}</h2>

                        {/* Display the users search results. */}
                        {currentlyShowing.type === USERS && <>
                            {displayMessage()}
                            <Container className="users-container" fluid>
                                {displayUserRows()}
                            </Container>
                        </>}

                        {/* Display the listings search results. */}
                        {currentlyShowing.type === LISTINGS && <>
                            <Row className="listings" md="auto">
                                {displayListings()}
                            </Row>
                        </>}

                        {/* Display the threads search results. */}
                        {currentlyShowing.type === THREADS && <>
                            {displayThreads()}
                        </>}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
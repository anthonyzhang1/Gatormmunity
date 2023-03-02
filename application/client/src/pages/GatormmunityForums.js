/* This file handles the display of the Gatormmunity Forums page. All of the Gatormmunity forum threads are shown on this page,
 * as components on a row. The user can filter the threads by category as well as sort them. */

import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from '../App.js';
import { Navigate, useNavigate } from "react-router-dom";
import { ANY_CATEGORY, ERROR_STATUS, THREAD_SORT_OPTIONS } from "../components/Constants.js";
import { getThreadCategoryFilterOptions } from "../components/Dropdowns.js";
import ForumThreadRow from "../components/forums/ForumThread";

export default function GatormmunityForums() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    const [categoryFilter, setCategoryFilter] = useState(ANY_CATEGORY); // only show threads of this category
    const [sortByOption, setSortByOption] = useState(THREAD_SORT_OPTIONS[0]); // sort threads by this setting
    const [threadData, setThreadData] = useState(null); // the threads returned by the back end

    /** 
     * Get the threads that are of the selected category, and sorted based on the selected sort by option.
     * 
     * Fetch Request's Body:
     * category: {string} The category the user wants to filter by. Can be null, which means show threads in all categories.
     * sortBy: {string} The setting to sort the threads by. Can be any option in THREAD_SORT_OPTIONS.
     */
    function getThreads() {
        fetch('/api/threads/get-threads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: categoryFilter === ANY_CATEGORY ? null : categoryFilter,
                sortBy: sortByOption
            })
        })
            .then(res => res.json())
            .then(data => setThreadData(data))
            .catch(console.log());
    }

    /** Maps all of the threads to a new component row. */
    function displayThreads() {
        // if no forum threads were found, show a message
        if (threadData.threads?.length === 0) return <h3 className='no-threads-message'>There are no threads to display.</h3>;
        else return threadData.threads?.map((thread) => { // display the threads
            return (
                <ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} creatorName={thread.creator_name}
                    title={thread.title} date={thread.creation_date} numPosts={thread.num_posts} category={thread.category}
                />
            );
        });
    }

    /* Get the threads when the page has loaded and when the user changes the category or sort by dropdown. */
    useEffect(() => getThreads(), [categoryFilter, sortByOption]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!threadData) return; // wait for fetch
    else if (threadData.status === ERROR_STATUS) return <h1 className='page-title'>{threadData.message}</h1>;
    else return (
        <div className="forums-page">
            <h2 className='page-title'>Gatormmunity Forums</h2>

            <Form className="category-sort-form">
                {/* Category Dropdown Filter */}
                <Form.Group className="category-filter-group" controlId="gatormmunity-forums-category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select onChange={e => setCategoryFilter(e.target.value)}>
                        {/* Lists all the valid categories into the dropdown */}
                        {getThreadCategoryFilterOptions()}
                    </Form.Select>
                </Form.Group>

                <Button className="create-thread-button default-button-color" onClick={() => navigate('/create-thread')}>
                    Create Thread
                </Button>

                {/* Thread Sort Options */}
                <Form.Group className="sort-options-group" controlId="gatormmunity-forums-thread-sort">
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select onChange={e => setSortByOption(e.target.value)}>
                        {/* Maps all the thread sort options into the dropdown. */}
                        {THREAD_SORT_OPTIONS.map((option, index) => {
                            return <option key={index} value={option}>{option}</option>;
                        })}
                    </Form.Select>
                </Form.Group>
            </Form>

            {/* Get all of the thread rows. */}
            {displayThreads()}
        </div>
    );
}
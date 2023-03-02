import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from '../App.js';
import { Navigate, useNavigate } from "react-router-dom";
import ForumThreadRow from "../components/forums/ForumThread";
import { ANY_CATEGORY, ERROR_STATUS } from "../components/Constants.js";
import { getThreadCategoryFilterOptions } from "../components/search/SearchDropdowns.js";

export default function GatormmunityForums() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();

	const [categoryFilter, setCategoryFilter] = useState(ANY_CATEGORY);
	const [threadData, setThreadData] = useState(null);

	/** 
	 * Gets the threads for the Gatormmunity Forums according to the category selected, if one was selected.
	 * 
	 * The front end sends:
	 * category: {string} The category the user wants to filter by. Can be null, which means show threads in all categories.
	 */
	function getThreads() {
		fetch('/api/threads/get-threads', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				category: categoryFilter === ANY_CATEGORY ? null : categoryFilter
			})
		})
			.then(res => res.json())
			.then(data => setThreadData(data))
			.catch(console.log());
	}

	/** Maps all of the threads in the search result to a new ThreadRow component. */
	function displayThreads() {
		return threadData?.threads?.map((thread) => {
			return (
				<ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} creatorName={thread.creator_name}
					title={thread.title} date={thread.creation_date} numPosts={thread.num_posts}
				/>
			);
		});
	}

	/* Get the threads when the page has loaded and when the user changes the category filter. */
	useEffect(() => getThreads(), [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) return; // wait for fetch
	else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
	else if (!threadData) return; // wait for fetch
	else if (threadData.status === ERROR_STATUS) return <h1 className='page-title'>{threadData.message}</h1>;
	else return (
		<div className="forums-page">
			<h2 className='page-title'>Gatormmunity Forums</h2>

			<Form className="category-form">
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

				<div className='invisible-element-for-flexbox'></div>
			</Form>

			{/* Get all of the thread rows. */}
			{displayThreads()}
		</div>
	);
}
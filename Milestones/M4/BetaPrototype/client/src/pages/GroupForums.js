import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from '../App.js';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ANY_CATEGORY, ERROR_STATUS } from "../components/Constants.js";
import ForumThreadRow from "../components/forums/ForumThread";
import { getThreadCategoryFilterOptions } from "../components/search/SearchDropdowns.js";

export default function GroupForums() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();
	let { groupId } = useParams(); // groupId in the URL
	groupId = parseInt(groupId); // converts groupId from a string to an int

	const [categoryFilter, setCategoryFilter] = useState(ANY_CATEGORY);
	const [threadData, setThreadData] = useState(null); // the threads and their titles, timestamps, etc.

	/** 
	 * Gets the threads for the group's forums according to the category selected, if one was selected.
	 * 
	 * The front end sends:
	 * category: {string} The category the user wants to filter by. Can be null,
	 *     which means show threads in all categories.
	 * groupId: {int} The id of the group whose threads we want to see.
	 * userId: {int} The id of the user viewing the threads.
	 */
	function getThreads() {
		if (!userSession?.user_id) return;

		fetch('/api/threads/get-threads', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				category: categoryFilter === ANY_CATEGORY ? null : categoryFilter,
				groupId: groupId,
				userId: userSession.user_id
			})
		})
			.then(res => res.json())
			.then(data => setThreadData(data))
			.catch(console.log());
	}

	/** Maps all of the threads in the search result to a new ThreadRow component. */
	function displayThreads() {
		return threadData.threads.map((thread) => {
			return (
				<ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} creatorName={thread.creator_name}
					title={thread.title} date={thread.creation_date} numPosts={thread.num_posts}
				/>
			);
		});
	}

	/* Get the threads when the page has loaded and when the user changes the category filter. */
	useEffect(() => getThreads(), [categoryFilter, userSession]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) return; // wait for fetch
	else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
	else if (!threadData) return; // wait for fetch
	else if (threadData.status === ERROR_STATUS) return <h1 className='page-title'>{threadData.message}</h1>;
	else return (
		<div className="forums-page">
			<h2 className='page-title'>{threadData.groupName}'s Forums</h2>

			<Form className="category-form">
				{/* Category Dropdown Filter */}
				<Form.Group className="category-filter-group" controlId="group-forums-category">
					<Form.Label>Category</Form.Label>
					<Form.Select onChange={e => setCategoryFilter(e.target.value)}>
						{/* Lists all the valid categories into the dropdown */}
						{getThreadCategoryFilterOptions()}
					</Form.Select>
				</Form.Group>

				<Button className="create-thread-button default-button-color"
					onClick={() => navigate(`/group-create-thread/${groupId}`)}
				>
					Create Thread
				</Button>

				<div className='invisible-element-for-flexbox'></div>
			</Form>

			{/* Get all of the thread rows. */}
			{displayThreads()}
		</div>
	);
}
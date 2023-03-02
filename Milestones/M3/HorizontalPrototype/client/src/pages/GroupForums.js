import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from '../App.js';
import { useNavigate, useParams } from "react-router-dom";
import ForumThreadRow from "../components/forums/ForumThread";
import { mockGroups, mockThreads, mockUsers } from "../components/M3MockData";

export default function GroupForums() {
	const ALL_CATEGORY = "All";

	const userSession = useContext(UserContext); // the user's session data
	let { groupId } = useParams(); // groupId in the URL
	groupId = parseInt(groupId); // converts groupId from a string to an int
	const navigate = useNavigate();

	/** The categories we can filter by. */
	const categoryFilterList = [ALL_CATEGORY, "General", "Social", "Questions"];

	const [threadData, setThreadData] = useState([]); // the threads and their titles, timestamps, etc.

	/** Applies the category filter to the threads such that only the threads that match the category are displayed. */
	function applyCategoryFilter(e) {
		const categoryFilter = e.target.value; // get selected category

		// only show threads that belong to this group's forums
		let threads = mockThreads.filter((thread) => thread.group_id === groupId).reverse();

		// only threads that are of the correct category are left in `threads`
		if (categoryFilter !== ALL_CATEGORY) {
			threads = threads.filter((thread) => thread.category === categoryFilter);
		}

		setThreadData(threads);
	}

	/* Use the mock threads as our initial threads, but only the ones which belong to this group. */
	useEffect(() => {
		setThreadData(mockThreads.filter((thread) => thread.group_id === groupId).reverse());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } return (
		<div className="forums-page">
			<h2 className='page-title'>{mockGroups.find(group => group.group_id === groupId).name}'s Forums</h2>

			<Form className="category-form">
				{/* Category Dropdown Filter */}
				<Form.Group className="category-filter-group" controlId="group-forums-category">
					<Form.Label>Category:</Form.Label>
					<Form.Select onChange={e => applyCategoryFilter(e)}>
						{/* Lists all the valid categories into the dropdown */}
						{categoryFilterList.map((category, index) => {
							return (
								<option key={index} value={category}>{category}</option>
							);
						})}
					</Form.Select>
				</Form.Group>

				<Button className="create-thread-button default-button-color"
					onClick={() => { navigate(`/group-create-thread/${groupId}`) }}
				>
					Create Thread
				</Button>

				<div className='invisible-element-for-flexbox'></div>
			</Form>

			{/* Maps all the thread data to thread rows. */}
			{threadData.map((thread) => {
				// Get the name of the author given the author's id.
				const author = mockUsers.find(user => user.user_id === thread.author_id).full_name;

				return (
					<ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} author={author} title={thread.title}
						date={thread.date} numPosts={thread.num_posts} category={thread.category}
					/>
				);
			})}
		</div>
	);
}
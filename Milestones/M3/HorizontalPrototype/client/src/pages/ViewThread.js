import { useContext, useEffect, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { UserContext } from '../App.js';
import { useParams } from "react-router-dom";
import ForumPostRow from "../components/forums/ForumPost";
import { mockPosts, mockThreads, mockUsers } from "../components/M3MockData";

export default function ViewThread() {
	const userSession = useContext(UserContext); // the user's session data
	let { threadId } = useParams(); // threadId in the URL
	threadId = parseInt(threadId); // converts threadId from a string to an int

	const [postData, setPostData] = useState([]); // the posts and their content, timestamps, etc.
	const [currentMessage, setCurrentMessage] = useState(""); // stores the input from the message text entry field

	function makePost(e) {
		e.preventDefault();

		alert("Post made!"); // TODO: M4
		setCurrentMessage("");
	}

	/* Get the posts from our mock post data, but only the ones which belong to this thread. */
	useEffect(() => {
		setPostData(mockPosts.filter(post => post.thread_id === threadId));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else if (!postData.length) {
		return <h1 className='page-title'>This thread does not exist.</h1>
	} else return (
		<div className="view-thread-page">
			<h3 className='page-title'>{mockThreads.find(thread => thread.thread_id === threadId).title}</h3>

			{/* Maps all the post data to post rows. */}
			{postData.map((post) => {
				// Get the name of the author given the author's id.
				const author = mockUsers.find(user => user.user_id === post.author_id);

				return (
					<ForumPostRow key={post.post_id} authorId={author.user_id} postBody={post.body}
						authorThumbnail={author.profile_picture_thumbnail_path} authorName={author.full_name} date={post.date}
						postThumbnail={post.thumbnail_path} filename={post.filename} postImage={post.image_path}
					/>
				);
			})}

			<Form className='make-post-form' onSubmit={makePost}>
				{/* Make Post Textarea Field */}
				<Form.Group className='make-post-group' controlId='thread-make-post'>
					<Form.Control className='make-post-control' required as='textarea'
						rows={3} value={currentMessage} placeholder='Make a post...'
						onChange={e => setCurrentMessage(e.target.value)}
					/>
				</Form.Group>

				<Button className="post-button default-button-color" type='submit'>Post</Button>
			</Form>
		</div>
	);
}
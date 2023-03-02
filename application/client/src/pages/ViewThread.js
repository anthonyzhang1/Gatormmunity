/* This file handles the display of the View Thread page, which shows all of the posts that belong to a thread, for both
 * Gatormmunity Forums and Group Forums threads. The page takes user input for creating a new post in the thread. */

import { useContext, useEffect, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../App.js';
import { ERROR_STATUS, GROUP_MODERATOR_ROLE, MODERATOR_ROLE, SUCCESS_STATUS } from "../components/Constants.js";
import ForumPostRow from "../components/forums/ForumPost";

export default function ViewThread() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { threadId } = useParams(); // the threadId in the URL
    threadId = parseInt(threadId); // casts threadId from a string to an int

    const [getPostData, setPostData] = useState(null); // holds the posts sent from the back end
    const [makePostData, setMakePostData] = useState(null); // holds the back end's response after making a post
    const [deleteThreadData, setDeleteThreadData] = useState(null); // holds the back end's response after deleting the thread
    const [deletePostData, setDeletePostData] = useState(null); // holds the back end's response after deleting a post
    const [currentMessage, setCurrentMessage] = useState(""); // stores the input from the post text field

    /**
     * Sends the body of the post to the back end for it to insert into the database.
     * 
     * Fetch Request's Body:
     * body: {string} The body of the post. It must be 1-10'000 characters long.
     * threadId: {int} The id of the thread we are making the post in. It is required, and must be a positive integer.
     * authorId: {int} The id of the post's author. It is required, and must be a positive integer.
     */
    function makePost(e) {
        e.preventDefault();

        fetch('/api/threads/make-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: currentMessage,
                threadId: threadId,
                authorId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setMakePostData(data))
            .catch(console.log());
    }

    /**
     * Gets the posts in the thread we are trying to view.
     * 
     * Fetch Request's Body:
     * threadId: {int} The id of the thread we are trying to view.
     * userId: {int} The id of the user viewing the thread.
     */
    function getPosts() {
        if (!userSession?.isLoggedIn) return;

        fetch('/api/threads/view-thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                threadId: threadId,
                userId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /**
     * Sends the request to the back end to delete the thread.
     * 
     * Fetch Request's Body:
     * threadId: {int} The id of the thread to delete.
     */
    function deleteThread() {
        fetch('/api/threads/delete-thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ threadId: threadId })
        })
            .then(res => res.json())
            .then(data => setDeleteThreadData(data))
            .catch(console.log());
    }

    /** Asks the user if they want to actually delete the thread. */
    function confirmDeleteThread() {
        if (window.confirm("Are you sure you want to delete this thread?\nPress OK to delete.")) deleteThread();
    }

    /* Display the thread's posts after rendering the page. */
    useEffect(() => getPosts(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* If we successfully made a post, refresh the thread, clear the form,
     * and scroll to the bottom of the page to see the new post. Otherwise, show an error. */
    useEffect(() => {
        if (makePostData?.status === SUCCESS_STATUS) {
            getPosts();
            setCurrentMessage("");

            window.scroll({
                top: document.body.offsetHeight,
                left: 0,
                behavior: 'smooth'
            });
        } else if (makePostData?.status === ERROR_STATUS) {
            alert(makePostData.message);
        }
    }, [makePostData]); // eslint-disable-line react-hooks/exhaustive-deps

    /* If we successfully deleted the thread, navigate back to the Group Forums or Gatormmunity Forums page, depending on if
     * we are viewing a Group Forum thread or a Gatormmunity Forum thread. On error, show an error message. */
    useEffect(() => {
        if (deleteThreadData?.status === SUCCESS_STATUS) {
            alert("Thread deleted!");
            navigate(getPostData.groupId ? `/group-forums/${getPostData.groupId}` : '/forums');
        } else if (deleteThreadData?.status === ERROR_STATUS) {
            alert(deleteThreadData.message);
        }
    }, [deleteThreadData]); // eslint-disable-line react-hooks/exhaustive-deps

    /* If we successfully deleted the post, refresh the thread. Otherwise, show an error. */
    useEffect(() => {
        if (deletePostData?.status === SUCCESS_STATUS) getPosts();
        else if (deletePostData?.status === ERROR_STATUS) alert(deletePostData.message);
    }, [deletePostData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!getPostData) return; // wait for fetch
    else if (getPostData.status === ERROR_STATUS) return <h1 className='page-title'>{getPostData.message}</h1>;
    else return (
        <div className="view-thread-page">
            {/* The links at the top of the thread page. */}
            <div className='thread-links'>
                {/* Lets the user navigate back to the Gatormmunity or Group Forums page, depending on whether the thread
				  * is a Gatormmunity or Group thread. */}
                <Link className='back-link' to={getPostData.groupId ? `/group-forums/${getPostData.groupId}` : '/forums'}>
                    Back to Forums
                </Link>

                {/* Only group moderators or moderators can delete threads. */}
                {(getPostData.groupRole >= GROUP_MODERATOR_ROLE || userSession.role >= MODERATOR_ROLE) &&
                    <span className='delete-thread' onClick={() => confirmDeleteThread()}>Delete Thread</span>
                }
            </div>

            <h3 className='page-title'>{getPostData.title}</h3>

            {/* Maps all the posts to a ForumPostRow component. */}
            {getPostData.posts.map((post) => {
                return (
                    <ForumPostRow key={post.post_id} postId={post.post_id} authorId={post.author_id} postBody={post.body}
                        authorThumbnail={post.profile_picture_thumbnail_path} authorName={post.author_name}
                        date={post.creation_date} postThumbnail={post.thumbnail_path} filename={post.filename}
                        postImage={post.image_path} isOriginalPost={post.is_original_post} userRole={userSession.role}
                        groupRole={getPostData.groupRole} setDeletePostData={setDeletePostData}
                    />
                );
            })}

            <Form className='make-post-form' onSubmit={makePost}>
                {/* Make Post Text Field */}
                <Form.Group className='make-post-group' controlId='thread-make-post'>
                    <Form.Control className='make-post-control' required as='textarea'
                        rows={8} value={currentMessage} placeholder='Type your post here...'
                        onChange={e => setCurrentMessage(e.target.value)}
                    />
                </Form.Group>

                <Button className="post-button default-button-color" type='submit'>Post</Button>
            </Form>
        </div>
    );
}
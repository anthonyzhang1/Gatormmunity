/* This file holds the component which displays a singular post in the View Thread page. */

import { useNavigate } from "react-router-dom";
import { GROUP_MODERATOR_ROLE, MODERATOR_ROLE } from "../Constants";

export default function ForumPost(props) {
    const {
        authorId, authorThumbnail, authorName, date, postThumbnail, filename, postImage, postBody,
        isOriginalPost, postId, groupRole, userRole, setDeletePostData
    } = props;
    const navigate = useNavigate();

    /**
     * Asks the back end to delete the post. The returned data is handled by the page, not this component.
     * 
     * Fetch Request's Body:
     * postId: {int} The id of the post to be deleted.
     */
    function deletePost() {
        fetch('/api/threads/delete-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: postId })
        })
            .then(res => res.json())
            .then(data => setDeletePostData(data))
            .catch(console.log());
    }

    /** Asks the user if they want to actually delete the post. */
    function confirmDeletePost() {
        if (window.confirm("Are you sure you want to delete this post?\nPress OK to delete.")) deletePost();
    }

    return (
        <div className="forum-post-row-comp">
            <div className="top-part">
                {/* The author's image and name can be clicked on to go to their page. */}
                <div className='author-thumbnail-name' onClick={() => navigate(`/user/${authorId}`)}>
                    <img className='author-thumbnail' src={`/${authorThumbnail}`} alt='author pfp' height='50' width='50' />
                    <p className='author-name'>{authorName}</p>
                </div>

                <div className='top-right-div'>
                    {/* Only group moderators or moderators can delete posts. However, an original post cannot be deleted. */}
                    {(!isOriginalPost && (groupRole >= GROUP_MODERATOR_ROLE || userRole >= MODERATOR_ROLE)) &&
                        <p className='delete-post' onClick={() => confirmDeletePost()}>Delete Post</p>
                    }

                    {/* The post's creation date. */}
                    <p className='date'>{new Date(date).toLocaleString('en-US', { hourCycle: 'h23' })}</p>
                </div>
            </div>

            <div className="bottom-part">
                {/* Show the post's image if there is one. The image can be clicked,
				  * which shows the image in its original size on a different page. */}
                {postThumbnail && <div className='post-thumbnail-filename'>
                    <img className='post-thumbnail' src={`/${postThumbnail}`} alt='post thumbnail' height='250' width='250'
                        onClick={() => window.open(`/${postImage}`)}
                    />
                    <p className='post-filename'>{filename}</p>
                </div>}

                {/* The content of the post. */}
                <p className='post-body'>{postBody}</p>
            </div>
        </div>
    );
}
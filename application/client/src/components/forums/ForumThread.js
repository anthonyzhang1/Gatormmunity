/* This file holds the component which displays a singular thread row on the Forums page. */

import { useNavigate } from "react-router-dom";

export default function ForumThread(props) {
    const { threadId, creatorName, title, date, numPosts, category } = props;
    const navigate = useNavigate();

    return (
        <div className="forum-thread-row-component" onClick={() => navigate(`/thread/${threadId}`)}>
            {/* The title is the only entry on the top row of the component. */}
            <p className='title'>{title}</p>

            {/* Elements in this div show on the bottom row of the component. */}
            <div className="bottom-div">
                <p className="category">Category: {category}</p>
                <p className="creator-name">By: {creatorName}</p>

                {/* Elements in this div show on the bottom row of the component, on the right side. */}
                <div className="bottom-right-div">
                    <p className="thread-date">Created: {new Date(date).toLocaleString('en-US', { hourCycle: 'h23' })}</p>
                    <img className="num-posts-icon" src="/images/assets/threadPostsIcon.png" height="25" width="25"
                        alt="num posts icon"
                    />

                    {/* The number of posts in the thread. */}
                    <p className="num-posts">{numPosts}</p>
                </div>
            </div>
        </div>
    );
}
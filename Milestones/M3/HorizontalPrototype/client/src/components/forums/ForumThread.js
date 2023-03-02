import { useNavigate } from "react-router-dom";

export default function ForumThread(props) {
	const { threadId, author, title, date, numPosts, category } = props;
	const navigate = useNavigate();

	return (
		<div className="forum-thread-row-component" onClick={() => { navigate(`/thread/${threadId}`) }}>
			<p className='thread-category'>[{category}] {title}</p>

			<div className="bottom-div">
				<p>By: {author}</p>
				<div className="bottom-right-div">
					<p className="thread-date">{date}</p>
					<img className="thread-posts-number-icon" src="/images/assets/threadPostsIcon.png" alt="num posts icon"
						height="25" width="25"
					/>
					<p className="thread-posts-number">{numPosts}</p>
				</div>
			</div>
		</div>
	);
}
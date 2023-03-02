import { useNavigate } from "react-router-dom";

export default function ForumPost(props) {
	const { authorId, authorThumbnail, authorName, date, postThumbnail, filename, postImage, postBody } = props;
	const navigate = useNavigate();

	return (
		<div className="forum-post-row-comp">
			<div className="top-part">
				{/* The author's image and name can be clicked on to go to their page. */}
				<div className='author-thumbnail-name' onClick={() => navigate(`/user/${authorId}`)}>
					<img className='author-thumbnail' src={authorThumbnail} alt='author pfp' height='50' width='50' />
					<p className='author-name'>{authorName}</p>
				</div>

				<p className='date'>{date}</p>
			</div>

			<div className="bottom-part">
				{/* Show the post's image if there is one. The image can be clicked to see it in better detail. */}
				{postThumbnail && <div className='post-thumbnail-filename'>
					<img className='post-thumbnail' src={postThumbnail} alt='post thumbnail' height='250' width='250'
						onClick={() => window.open(postImage)}
					/>
					<p className='post-filename'>{filename}</p>
				</div>}

				<p className='post-body'>{postBody}</p>
			</div>
		</div>
	);
}
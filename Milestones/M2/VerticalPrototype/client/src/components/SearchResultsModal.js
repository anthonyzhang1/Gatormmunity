import { Button, Modal, Container } from 'react-bootstrap';
import UserRow from './search_results/UserRow';

/** Shows the user search results from the search bar in a modal. */
export default function SearchResultsModal(props) {
	// searchTerms: the search terms the user entered into the search bar
	// roleFilter: the role filter the user applied
	// searchResult: the data returned from the search result containing the users
	const { show, onHide, searchTerms, roleFilter, searchResult } = props;

	/** Determines what title should be shown depending on what the user searched for and the search results. */
	function displayTitle() {
		let title = ""; // the title to be displayed

		// customize the title of the modal based on the role filter
		switch (roleFilter) {
			case "":
				title = "Searching all users";
				break;
			case "1":
				title = "Searching Approved Users";
				break;
			case "2":
				title = "Searching Moderators";
				break;
			case "3":
				title = "Searching Administrators";
				break;
			default:
				title = "Searching Invalid Roles";
		}

		// customize the title of the modal based on whether search terms were provided
		if (searchTerms.length > 0) {
			title += ` for "${searchTerms}":`;
		} else {
			title += ":";
		}

		// add how many users were matched to the title
		return (title + ` ${searchResult?.numUsersMatched} user(s) matched.`);
	}

	/** Determines which message should be shown depending on what the user searched for and the search results. */
	function displayMessage() {
		if (searchResult?.users?.length === 0) { // if the search returned 0 users as a result of an empty database
			return (
				<h4 className="search-message">
					No users have registered. Therefore, there are no users to show.
				</h4>
			);
		} else if (searchResult?.numUsersMatched === 0) { // if the search matched 0 users
			return (
				<h4 className="search-message">
					No users matched your search terms, so here are a few of our newest members instead!
				</h4>
			);
		}
	}

	/** Maps all of the users in the search result to a new row in the modal. */
	function displayUserRows() {
		return searchResult?.users?.map((user, index) => {
			return (
				<UserRow key={index} fullName={user.full_name} profilePicturePath={user.profile_picture_path}
					profilePictureThumbnailPath={user.profile_picture_thumbnail_path}
					role={user.role} joinDate={user.join_date}
				/>
			);
		});
	}

	return (
		<Modal dialogClassName="search-results-modal-component" show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title className="search-modal-title">
					{/* Determine what the title should be, based on the search terms and filter */}
					{searchResult && displayTitle()}
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{/* Let the user know if the search is currently in progress */}
				{!searchResult && <h1>Searching...</h1>}

				{/* Potentially display a message */}
				{displayMessage()}

				{/* All the user search results will be stored in this Container element */}
				<Container className="search-results-container" fluid>
					{displayUserRows()}
				</Container>
			</Modal.Body>

			<Modal.Footer>
				{/* Close Button */}
				<Button className="default-button-color" onClick={onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
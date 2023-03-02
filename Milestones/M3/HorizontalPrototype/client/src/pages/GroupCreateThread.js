import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import { mockGroups, mockThreads } from "../components/M3MockData";
import * as questions from '../components/help/Questions';

export default function GroupCreateThread() {
	/** The default category option. */
	const GENERAL_CATEGORY = "General";

	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();
	const threadImageInput = useRef();

	let { groupId } = useParams(); // groupId in the URL
	groupId = parseInt(groupId); // converts groupId from a string to an int

	/** The links that will be shown in the helpful links list. */
	const links = [
		questions.whichForumCategory,
		questions.reportUser
	];

	/** The options for the category dropdown. */
	const categories = [
		GENERAL_CATEGORY,
		"Social",
		"Questions"
	];

	// contains the form's data
	const [form, setForm] = useState({
		threadTitle: "",
		threadBody: "",
		category: GENERAL_CATEGORY // the default category
	});

	const [threadImage, setThreadImage] = useState(null); // stores the thread's image
	// const [returnData, setReturnData] = useState(null); // stores the data sent back from the back end (used in M4)

	/** Updates the create thread form's state. */
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	/**
	 * Sends the form to the back end to create the thread.
	 * The back end should validate the input.
	 *
	 * The front end sends:
	 * threadTitle: string with the thread's title. It must be 1-255 characters long.
	 * threadBody: string with the thread's body. It must be 1-10'000 characters long.
	 * category: string with the thread's category. It it required and must be one of the predefined category options.
	 * groupId: int with the group's ID. This is the group that will own the new thread.
	 * threadImage: File with the thread's image. It is optional, and must be JPEG, PNG, WebP, GIF, or AVIF,
	 *     and must have a max file size of 5 MB.
	 */
	async function createThread(e) {
		e.preventDefault();
		const threadId = Math.floor(Math.random() * mockThreads.length); // get a random threadId

		/** The form that we send to the backend containing the thread's data. */
		const formData = new FormData();

		for (const index in form) { // append the form's content to `formData`
			formData.append(index, form[index]);
		}
		formData.append("groupId", groupId);
		formData.append("threadImage", threadImage);

		alert("Group thread created!"); // TODO: M4
		navigate(`/thread/${threadId}`);

		/*
		await fetch("/api/groups/create-group-thread", {
			method: "POST",
			body: formData
		})
			.then((res) => res.json())
			.then((data) => { setReturnData(data); }) // store what the back end sent to us
			.catch(console.log());
		*/
	}

	if (!userSession) {
		return <h1 className='page-title'>You must be logged in to see this page.</h1>
	} return (
		<div className="create-thread-page">
			<Container className="create-thread-container" fluid>
				<Row>
					{/* The left column with the helpful links list in it */}
					<Col className="helpful-links-col" md="auto">
						<HelpfulLinksList questions={links} />
					</Col>

					{/* The right column with the create thread form in it */}
					<Col className="form-col" md="auto">
						<div className="form-div">
							<h4 className="create-thread-header">
								Create {mockGroups.find(group => group.group_id === groupId).name} Forums Thread
							</h4>

							<Form className="create-thread-form" onSubmit={createThread}>
								{/* Thread Title Field */}
								<Form.Group className="thread-title mb-3" controlId="create-thread-title">
									<Form.Label>Thread Title</Form.Label>
									<Form.Control required type="text" placeholder="Enter thread title..."
										value={form.threadTitle} onChange={(e) => updateForm({ threadTitle: e.target.value })}
									/>
								</Form.Group>

								{/* Thread Body Field */}
								<Form.Group className="mb-4" controlId="create-thread-body">
									<Form.Label>Thread Body</Form.Label>
									<Form.Control required as="textarea" rows={9} placeholder="Enter thread body..."
										value={form.threadBody} onChange={(e) => updateForm({ threadBody: e.target.value })}
									/>
								</Form.Group>

								{/* Thread Image Field */}
								<Form.Group className="mb-4" controlId="create-thread-photo">
									<Form.Label>Attach an Image (optional)</Form.Label>
									<Form.Control className="thread-image" type="file" name="threadImage" ref={threadImageInput}
										onChange={(e) => setThreadImage(e.target.files[0])}
									/>
									<Form.Text>
										Accepted image formats are: JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
									</Form.Text>
								</Form.Group>

								{/* Category Dropdown */}
								<Form.Group as={Row} className="mb-2" controlId="group-create-thread-category">
									<Form.Label className="category-label" column md="auto">Category:</Form.Label>
									<Col>
										<Form.Select className="category-field" aria-label="category" value={form.category}
											onChange={(e) => updateForm({ category: e.target.value })}
										>
											{/* Inserts all the categories into the dropdown */}
											{categories.map((category, index) => {
												return (
													<option key={index} value={category}>{category}</option>
												);
											})}
										</Form.Select>
									</Col>
								</Form.Group>

								{/* Create Thread Button */}
								<Button className='create-button default-button-color' type='submit'>
									Create
								</Button>
							</Form>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
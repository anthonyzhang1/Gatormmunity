/* This file handles the display of the Create Thread page for the Gatormmunity Forums (not group forums).
 * The page takes user input for creating the thread, which is sent to the back end for validation and thread creation. */

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import { whichForumCategory, reportUser } from '../components/help/Questions';
import { ERROR_STATUS, SUCCESS_STATUS, THREAD_CATEGORIES } from "../components/Constants";

export default function CreateThread() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();
	const threadImageInput = useRef();

	/** The links that will be shown in the helpful links list. */
	const links = [whichForumCategory, reportUser];

	// contains the form's data
	const [form, setForm] = useState({
		threadTitle: "",
		threadBody: "",
		category: THREAD_CATEGORIES[0] // the default category
	});

	const [threadImage, setThreadImage] = useState(null); // stores the thread's image
	const [returnData, setReturnData] = useState(null); // stores the data sent back from the back end

	/** Updates the create thread form's state. */
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	/**
	 * Sends the create thread form to the back end to create the thread.
	 *
	 * The front end sends:
	 * threadTitle: {string} The thread's title. Required; must be 1-255 characters.
	 * threadBody: {string} The thread's body. Required; must be 1-10'000 characters.
	 * category: {string} The thread's category. Required; must be a predefined category.
	 * creatorId: {int} The thread creator's user id. Required; must be a positive integer.
	 * threadImage: {File} The thread's image. Optional; must be JPEG, PNG, WebP, GIF, or AVIF; cannot exceed 5 MB.
	 */
	async function createThread(e) {
		e.preventDefault();

		/** The form that we send to the backend containing the thread's data. */
		const formData = new FormData();

		// append the form's content to `formData`
		for (const index in form) formData.append(index, form[index]);
		formData.append("creatorId", userSession.user_id); // the id of the user creating the thread
		if (threadImage) formData.append("threadImage", threadImage); // only append threadImage if it was provided

		await fetch("/api/threads/create-thread", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => setReturnData(data))
			.catch(console.log());
	}

	/* Redirects to the newly created thread's page upon successful thread creation. Otherwise, show an error. */
	useEffect(() => {
		if (returnData?.status === SUCCESS_STATUS) navigate(`/thread/${returnData.threadId}`);
		else if (returnData?.status === ERROR_STATUS) alert(returnData.message);
	}, [returnData]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) return; // wait for fetch
	else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
	else return (
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
							<h4 className="create-thread-header">Create Gatormmunity Forums Thread</h4>

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
								<Form.Group as={Row} className="mb-2" controlId="create-thread-category">
									<Form.Label className="category-label" column md="auto">Category:</Form.Label>
									<Col>
										<Form.Select className="category-field" aria-label="category" value={form.category}
											onChange={(e) => updateForm({ category: e.target.value })}
										>
											{/* Inserts all the categories into the dropdown */}
											{THREAD_CATEGORIES.map((category, index) => {
												return <option key={index} value={category}>{category}</option>;
											})}
										</Form.Select>
									</Col>
								</Form.Group>

								{/* Create Thread Button */}
								<Button className='create-button default-button-color' type='submit'>Create</Button>
							</Form>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
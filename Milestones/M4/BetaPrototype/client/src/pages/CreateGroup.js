/* This file handles the display of the Create Group page. The page takes user input for creating the group,
 * which is sent to the back end for validation and group creation. */

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { UserContext } from '../App.js';
import { Navigate, useNavigate } from 'react-router-dom';
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import * as questions from '../components/help/Questions';
import { ERROR_STATUS, SUCCESS_STATUS } from "../components/Constants.js";

export default function CreateGroup() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();
	const groupPictureInput = useRef();

	/** The links that will be shown in the helpful links list. */
	const links = [questions.groupPurpose];

	// contains the form's data
	const [form, setForm] = useState({
		groupName: "",
		groupDescription: ""
	});

	const [groupPicture, setGroupPicture] = useState(null); // stores the picture of the group
	const [returnData, setReturnData] = useState(null); // stores the data sent back from the back end

	/** Updates the create group form's state. */
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	/**
	 * Sends the form to the back end to create the group.
	 *
	 * The front end sends:
	 * groupName: {string} The group's name. Required; must be 1-255 characters.
	 * groupDescription: {string} The group's description. Optional; must be at most 5'000 characters.
	 * adminId: {int} The creator's (and therefore admin's) user id. Required; must be a positive integer.
	 * groupPicture: {File} The group's picture. Required; must be JPEG, PNG, WebP, GIF, or AVIF; cannot exceed 5 MB.
	 */
	async function createGroup(e) {
		e.preventDefault();

		/** The form that we send to the backend containing the form's data. */
		const formData = new FormData();

		// append the form's content to `formData`
		for (const index in form) formData.append(index, form[index]);
		formData.append("adminId", userSession.user_id);
		formData.append("groupPicture", groupPicture);

		await fetch("/api/groups/create-group", {
			method: "POST",
			body: formData
		})
			.then(res => res.json())
			.then(data => setReturnData(data)) // store what the back end sent to us
			.catch(console.log());
	}

	/* Redirect the user to the newly created group's home page on success, otherwise show an error. */
	useEffect(() => {
		if (returnData?.status === SUCCESS_STATUS) navigate(`/group/${returnData.groupId}`);
		else if (returnData?.status === ERROR_STATUS) alert(returnData.message);
	}, [returnData]); // eslint-disable-line react-hooks/exhaustive-deps

	if (!userSession) return; // wait for fetch
	else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
	else return (
		<div className="create-group-page">
			<Container className="create-group-container" fluid>
				<Row>
					{/* The left column with the helpful links list in it */}
					<Col className="helpful-links-col" md="auto">
						<HelpfulLinksList questions={links} />
					</Col>

					{/* The right column with the create group form in it */}
					<Col className="form-col" md="auto">
						<div className="form-div">
							<h4 className="create-group-header">Create Group</h4>

							<Form className="create-group-form" onSubmit={createGroup}>
								{/* Group Picture Field */}
								<Form.Group className="mb-3" controlId="create-group-picture">
									<Form.Label>Group Picture</Form.Label>
									<Form.Control required type="file" name="groupPicture" ref={groupPictureInput}
										onChange={(e) => setGroupPicture(e.target.files[0])}
									/>
									<Form.Text>
										Accepted image formats are: JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
									</Form.Text>
								</Form.Group>

								{/* Group Name Field */}
								<Form.Group className="group-name mb-3" controlId="create-group-name">
									<Form.Label>Group Name</Form.Label>
									<Form.Control required type="text" placeholder="Enter group name..." value={form.groupName}
										onChange={(e) => updateForm({ groupName: e.target.value })}
									/>
								</Form.Group>

								{/* Group Description Field */}
								<Form.Group className="mb-4" controlId="create-group-description">
									<Form.Label>Group Description (optional)</Form.Label>
									<Form.Control as="textarea" rows={6} placeholder="Enter group description..."
										value={form.groupDescription}
										onChange={(e) => updateForm({ groupDescription: e.target.value })}
									/>
								</Form.Group>

								{/* Create Group Button */}
								<Button className='create-button default-button-color' type='submit'>Create</Button>
							</Form>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
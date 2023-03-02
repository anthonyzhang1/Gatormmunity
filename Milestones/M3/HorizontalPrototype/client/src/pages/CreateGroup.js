import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { UserContext } from '../App.js';
import { useNavigate } from 'react-router-dom';
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import * as questions from '../components/help/Questions';
import { mockGroups } from "../components/M3MockData.js";

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
	// const [returnData, setReturnData] = useState(null); // stores the data sent back from the back end (used in M4)

	/** Updates the create group form's state. */
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	/**
	 * Sends the form to the back end to create the group.
	 * The back end should validate the input.
	 *
	 * The front end sends:
	 * groupName: string with the group's name. It must be 1-255 characters long.
	 * groupDescription: string with the group's description. It is optional, and can be at most 5000 characters long.
	 * groupPicture: File with the group's picture. It is required, and must be JPEG, PNG, WebP, GIF, or AVIF,
	 *     and cannot exceed 5 MB.
	 */
	async function createGroup(e) {
		e.preventDefault();
		const groupId = Math.floor(Math.random() * mockGroups.length); // get a random groupId

		/** The form that we send to the backend containing the form's data. */
		const formData = new FormData();

		for (const index in form) { // append the form's content to `formData`
			formData.append(index, form[index]);
		}
		formData.append("groupPicture", groupPicture); // append the group's picture to `formData`

		alert("Group created!"); // TODO: M4
		navigate(`/group/${groupId}`);

		// Don't actually call this until we have the back end in M4
		/*
		await fetch("/api/groups/create-group", {
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
	} else return (
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
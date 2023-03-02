import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { UserContext } from '../App.js';
import { useNavigate } from 'react-router-dom';
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import * as questions from '../components/help/Questions';
import { listingCategories } from "../components/M3MockData";

export default function CreateListing() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();
	const itemPhotoInput = useRef();

	/** The links that will be shown in the helpful links list. */
	const links = [
		questions.meetingBuyerSeller,
		questions.reportUser
	];

	// contains the form's data
	const [form, setForm] = useState({
		listingTitle: "",
		listingDescription: "",
		price: "",
		category: listingCategories[0] // the default category
	});

	const [itemPhoto, setItemPhoto] = useState(null); // stores the photo of the item
	// const [returnData, setReturnData] = useState(null); // stores the data sent back from the back end (used in M4)

	/** Updates the create listing form's state. */
	function updateForm(value) {
		return setForm((prev) => {
			return { ...prev, ...value };
		});
	}

	/**
	 * Sends the form to the back end to create the listing.
	 * The back end should validate the input.
	 *
	 * The front end sends:
	 * listingTitle: string with the listing's title. It must be 1-255 characters long.
	 * listingDescription: string with the listing's description. It must be 1-2500 characters long.
	 * price: string with the item's price. It is required and must be in a valid currency format, e.g. 21.55 or 21.
	 *     Must be non-negative.
	 * category: string with the item's category. It it required and must be one of the predefined category options.
	 * itemPhoto: File with the item's photo. It is required, and must be JPEG, PNG, WebP, GIF, or AVIF,
	 *     and must have a max file size of 5 MB.
	 */
	async function createListing(e) {
		e.preventDefault();

		/** The form that we send to the backend containing the listing's data. */
		const formData = new FormData();

		for (const index in form) { // append the form's content to `formData`
			formData.append(index, form[index]);
		}
		formData.append("itemPhoto", itemPhoto); // append the item's photo to `formData`

		alert("Listing created!"); // TODO: M4
		navigate("/marketplace");

		/*
		await fetch("/api/listings/create-listing", {
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
		<div className="create-listing-page">
			<Container className="create-listing-container" fluid>
				<Row>
					{/* The left column with the helpful links list in it */}
					<Col className="helpful-links-col" md="auto">
						<HelpfulLinksList questions={links} />
					</Col>

					{/* The right column with the create listing form in it */}
					<Col className="form-col" md="auto">
						<div className="form-div">
							<h4 className="create-listing-header">Create Listing</h4>

							<Form className="create-listing-form" onSubmit={createListing}>
								{/* Item Photo Field */}
								<Form.Group className="mb-3" controlId="create-listing-item-photo">
									<Form.Label>Item Photo</Form.Label>
									<Form.Control required type="file" name="itemPhoto" ref={itemPhotoInput}
										onChange={(e) => setItemPhoto(e.target.files[0])}
									/>
									<Form.Text>
										Show the item you are listing for sale. Accepted image formats are:
										JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
									</Form.Text>
								</Form.Group>

								{/* Listing Title Field */}
								<Form.Group className="listing-title mb-3" controlId="create-listing-title">
									<Form.Label>Listing Title</Form.Label>
									<Form.Control required type="text" placeholder="Enter title..." value={form.listingTitle}
										onChange={(e) => updateForm({ listingTitle: e.target.value })}
									/>
								</Form.Group>

								{/* Listing Description Field */}
								<Form.Group className="mb-4" controlId="create-listing-description">
									<Form.Label>Listing Description</Form.Label>
									<Form.Control required as="textarea" rows={5} placeholder="Enter description..."
										value={form.listingDescription}
										onChange={(e) => updateForm({ listingDescription: e.target.value })}
									/>
								</Form.Group>

								{/* Price Field */}
								<Form.Group as={Row} className="mb-3" controlId="create-listing-price">
									<Form.Label className="price-label" column md="auto">Price:&nbsp; $</Form.Label>
									<Col className="price-field-col">
										<Form.Control className="price-field" required type="number" step="0.01"
											placeholder="Enter price..." value={form.price}
											onChange={(e) => updateForm({ price: e.target.value })}
										/>
									</Col>
								</Form.Group>

								{/* Category Dropdown */}
								<Form.Group as={Row} className="mb-2" controlId="create-listing-category">
									<Form.Label className="category-label" column md="auto">Category: </Form.Label>
									<Col>
										<Form.Select className="category-field" aria-label="category" value={form.category}
											onChange={(e) => updateForm({ category: e.target.value })}
										>
											{/* Inserts all the categories into the dropdown */}
											{listingCategories.map((category, index) => {
												return (
													<option key={index} value={category}>{category}</option>
												);
											})}
										</Form.Select>
									</Col>
								</Form.Group>

								{/* Create Listing Button */}
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
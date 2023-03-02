/* This file handles the display of the Create Group Thread page for the Group Forums (not Gatormmunity Forums).
 * Here, the user can create threads in their group's forum by filling out a form. */

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS, THREAD_CATEGORIES } from "../components/Constants.js";
import HelpfulLinksList from "../components/help/HelpfulLinksList";
import { whatAreThreads, whichForumCategory } from '../components/help/Questions';

export default function GroupCreateThread() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    const threadImageInput = useRef();

    let { groupId } = useParams(); // the groupId in the URL
    groupId = parseInt(groupId); // converts groupId from a string to an int

    /** The questions that will be shown in the helpful links list. */
    const questions = [whatAreThreads, whichForumCategory];

    // contains the form's data
    const [form, setForm] = useState({
        threadTitle: "",
        threadBody: "",
        category: THREAD_CATEGORIES[3] // the default category (off-topic)
    });

    const [threadImage, setThreadImage] = useState(null); // stores the thread's image
    const [getData, setGetData] = useState(null); // stores the group's name sent by the back end
    const [postData, setPostData] = useState(null); // stores the data sent by the back end after submitting the forum

    /** Updates the create thread form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /**
     * Sends the form to the back end to create the group thread.
     *
     * Fetch Request's Body:
     * threadTitle: {string} The thread's title. Required; must be 1-255 characters.
     * threadBody: {string} The thread's body. Required; must be 1-10'000 characters.
     * category: {string} The thread's category. Required; must be one of the predefined category options.
     * groupId: {int} The id of the group that the thread will belong to. Required; must be a positive integer.
     * creatorId: {int} The thread creator's user id. Required; must be a positive integer.
     * threadImage: {File} The thread's image. Optional; must be JPEG, PNG, WebP, GIF, or AVIF; cannot exceed 5 MB.
     */
    function createThread(e) {
        e.preventDefault();

        /** The form that we send to the back end containing the thread's data. */
        const formData = new FormData();

        // append the form's content to `formData`
        for (const index in form) formData.append(index, form[index]);
        formData.append("groupId", groupId);
        formData.append("creatorId", userSession.user_id);
        if (threadImage) formData.append("threadImage", threadImage); // only append threadImage if it was provided

        fetch("/api/threads/create-thread", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /* 
     * Get the group's name as soon as the page loads.
     *
     * Fetch Request's Body:
     * userId: {int} The id of the user viewing the create group thread page.
     * groupId: {int} The id of the group the user is trying to create the thread in.
     */
    useEffect(() => {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/get-group-name/${userSession.user_id}/${groupId}`)
            .then(res => res.json())
            .then(data => setGetData(data))
            .catch(console.log())
    }, [userSession, groupId]);

    /* On successful thread creation, inform the user of such and redirect them to the newly created thread's page.
     * On error, show an error message. */
    useEffect(() => {
        if (postData?.status === SUCCESS_STATUS) {
            alert("Thread created!");
            navigate(`/thread/${postData.threadId}`);
        } else if (postData?.status === ERROR_STATUS) {
            alert(postData.message);
        }
    }, [postData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!getData) return; // wait for fetch
    else if (getData.status === ERROR_STATUS) return <h1 className='page-title'>{getData.message}</h1>;
    else return (
        <div className="create-thread-page">
            <Container className="create-thread-container" fluid>
                <Row>
                    {/* The left column with the helpful links list in it. */}
                    <Col className="helpful-links-col" md="auto">
                        <HelpfulLinksList questions={questions} />
                    </Col>

                    {/* The right column with the create thread form in it. */}
                    <Col className="form-col" md="auto">
                        <div className="form-div">
                            <h4 className="create-thread-header">
                                Create {getData.groupName} Forums Thread
                            </h4>

                            <Form className="create-thread-form" onSubmit={createThread}>
                                {/* Thread Title Field */}
                                <Form.Group className="thread-title mb-3" controlId="create-thread-title">
                                    <Form.Label>Thread Title</Form.Label>
                                    <Form.Control required type="text" placeholder="Enter thread title..."
                                        value={form.threadTitle} onChange={e => updateForm({ threadTitle: e.target.value })}
                                    />
                                </Form.Group>

                                {/* Thread Body Field */}
                                <Form.Group className="mb-4" controlId="create-thread-body">
                                    <Form.Label>Thread Body</Form.Label>
                                    <Form.Control required as="textarea" rows={9} placeholder="Enter thread body..."
                                        value={form.threadBody} onChange={e => updateForm({ threadBody: e.target.value })}
                                    />
                                </Form.Group>

                                {/* Thread Image Field */}
                                <Form.Group className="mb-4" controlId="create-thread-photo">
                                    <Form.Label>Attach an Image (optional)</Form.Label>
                                    <Form.Control className="thread-image" type="file" name="threadImage" ref={threadImageInput}
                                        onChange={e => setThreadImage(e.target.files[0])}
                                    />
                                    <Form.Text>
                                        Accepted image formats are: JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
                                    </Form.Text>
                                </Form.Group>

                                {/* Category Dropdown */}
                                <Form.Group as={Row} className="mb-2" controlId="create-group-thread-category">
                                    <Form.Label className="category-label" column md="auto">Category:</Form.Label>
                                    <Col>
                                        <Form.Select className="category-field" aria-label="category" value={form.category}
                                            onChange={e => updateForm({ category: e.target.value })}
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
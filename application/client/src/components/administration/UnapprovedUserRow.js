/* This file holds the component which displays an unapproved user row in the Administration page.
 * Each unapproved user will be in the Approval Requests tab of the page, where Gatormmunity moderators can choose to
 * approve or reject the unapproved user based on what they provided in the registration form. */

import { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { ERROR_STATUS, SUCCESS_STATUS } from '../Constants';

export default function UnapprovedUserRow(props) {
    const { userId, fullName, email, sfsuIdNumber, sfsuIdPicture, joinDate } = props;
    const [show, setShow] = useState(true); // determines whether to hide/show this component
    const [returnData, setReturnData] = useState(null); // stores the back end's data

    /**
     * Sends the approval or rejection of the unapproved user to the back end for handling.
     * 
     * Fetch Request's Body:
     * userId: {int} The id of the user being approved/rejected.
     * 
     * @param {boolean} isApproved Whether the user has been approved or not.
     */
    function handleApproval(isApproved) {
        /** Determines which route to use for fetch(), depending on if the user was approved or rejected. */
        const fetchURL = isApproved ? '/api/users/approve-user' : '/api/users/reject-user';

        fetch(fetchURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /* Hide the component if the user was successfully approved or rejected, or show an error on error. */
    useEffect(() => {
        if (returnData?.status === SUCCESS_STATUS) setShow(false);
        if (returnData?.status === ERROR_STATUS) alert(returnData.message);
    }, [returnData]);

    if (!show) return; // hide the component
    else return (
        <Row className="unapproved-user-row-comp">
            <Row className="thumbnail-name-row">
                {/* SFSU ID Picture Column */}
                <Col className="sfsu-id-card-col" md="auto">
                    <img className="sfsu-id-card" src={`/${sfsuIdPicture}`} alt="sfsu id card" width="150" height="150"
                        onClick={() => window.open(`/${sfsuIdPicture}`)}
                    />
                </Col>

                {/* User Details Column */}
                <Col className="full-name-col">
                    <p className='user-id'>User ID: {userId}</p>
                    <p className='full-name'>Name: {fullName}</p>
                    <p className='email'>Email: {email}</p>
                    <p className='sfsu-id-number'>SFSU ID: {sfsuIdNumber}</p>
                    <p className='join-date'>
                        Registered on: {new Date(joinDate).toLocaleString('en-US', { hourCycle: 'h23' })}
                    </p>
                </Col>

                {/* Approval/Rejection Buttons */}
                <Col className='buttons-col'>
                    <Row>
                        <Button className="approve-button default-button-color" onClick={() => handleApproval(true)}>
                            Approve
                        </Button>
                    </Row>
                    <Row>
                        <Button className="reject-button" onClick={() => handleApproval(false)}>Reject</Button>
                    </Row>
                </Col>
            </Row>
        </Row>
    );
}
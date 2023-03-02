/* This file holds the component which displays a modal for inviting a user to a group.
 * The component is called via the Group Home page. */

import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ERROR_STATUS, SUCCESS_STATUS } from '../Constants';

export default function GroupInviteModal(props) {
    const { show, onHide, groupId, senderId } = props;
    const [userInput, setUserInput] = useState(""); // contains the user's input
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the invite form to the back end.
     *
     * Fetch Request's Body:
     * recipientId: {int} The id of the user being invited.
     * groupId: {int} The id of the group that the user is being invited to.
     * senderId: {int} The id of the user doing the inviting.
     */
    function invite(e) {
        e.preventDefault();

        fetch('/api/groups/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipientId: userInput,
                groupId: groupId,
                senderId: senderId
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /* Display the success/error message on form submission and clear the form on success. */
    useEffect(() => {
        if (returnData?.status === SUCCESS_STATUS) {
            alert("Invite sent!");
            setUserInput("");
        } else if (returnData?.status === ERROR_STATUS) {
            alert(returnData.message);
        }
    }, [returnData]);

    return (
        <Modal dialogClassName='group-invite-modal' show={show} onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter" centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Invite User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={invite}>
                    {/* Invitee's User ID Field */}
                    <Form.Group className='mb-3' controlId='group-invite-ids'>
                        <Form.Label>Invite via User ID</Form.Label>
                        <Form.Control className='mb-1' required type='number' value={userInput}
                            placeholder='Enter the user ID of the user to invite, e.g. 11'
                            onChange={e => setUserInput(e.target.value)}
                        />
                    </Form.Group>

                    <div className='buttons-div'>
                        <Button className='cancel-button' variant='secondary' onClick={onHide}>Cancel</Button>
                        <Button className='invite-button default-button-color' type='submit'>Invite</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
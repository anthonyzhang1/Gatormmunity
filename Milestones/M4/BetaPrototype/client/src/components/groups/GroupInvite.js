import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ERROR_STATUS, SUCCESS_STATUS } from '../Constants';

export default function GroupInviteModal(props) {
    const { show, onHide, groupId, senderId } = props;
    const [userInput, setUserInput] = useState(""); // contains the user's input
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the invite form to the back end containing the id of the user to be invited.
     * 
     * The front end sends:
     * recipientId: {int} The id of the user being invited.
     * groupId: {int} The id of the group that the user is being invited to.
     * senderId: {int} The id of the user doing the inviting.
     */
    async function invite(e) {
        e.preventDefault();

        await fetch('/api/groups/invite', {
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

    /** Display the success/error message on form submission and clear the form on success. */
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
                    {/* User IDs Field */}
                    <Form.Group className='mb-3' controlId='group-invite-ids'>
                        <Form.Label>Send Invite to User</Form.Label>
                        <Form.Control className='mb-1' required type='number' value={userInput}
                            placeholder='Enter the ID of the user you are inviting, e.g. 11'
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
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function GroupInviteModal(props) {
    // groupId: the id of the group to invite the users to
    const { show, onHide } = props;
    const [userInput, setUserInput] = useState(""); // contains the user's input
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the invite form to the backend containing the array of ids to be invited to the group and the group's id.
     * The back end should check that `groupId` is a valid group and that `invitedIds` is composed only of positive integers and
     * can be casted to an int.
     * 
     * The front end sends:
     * invitedIds: Array of strings with each element being a user's user_id.
     * groupId: int containing the id of the group that the users are being invited to.
     */
    async function invite(e) {
        e.preventDefault();

        /** The array of ids to invite. */
        const invitedIds = userInput.split(/\s+/);

        if (invitedIds.some(isNaN)) { // if the array does not contain only integers, show an error
            setReturnData({ status: "error", message: "The user IDs must be integers separated by a single space." });
        } else { // if input passed the validation test
            setUserInput(""); // clears the form
            setReturnData({ status: "success" });
        }

        /* TODO: Implement in M4. */
        // await fetch('/api/groups/invite', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         invitedIds: invitedIds,
        //         groupId: groupId
        //     })
        // })
        //     .then(res => res.json())
        //     .then(data => { setReturnData(data); }) // store what the backend sent to us
        //     .catch(console.log());
    }

    /** Display the success/error message on form submission. */
    function displayMessage() {
        if (returnData?.status === "success") { // successful invite
            return <h3>Invites sent!</h3>;
        } else if (returnData?.status === "error") { // failed invite
            return <h4>{returnData.message}</h4>;
        }
    }

    return (
        <Modal dialogClassName='group-invite-modal' show={show} onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter" centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Invite Users</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Displays the success message on success. */}
                {displayMessage()}

                <Form onSubmit={invite}>
                    {/* User IDs Field */}
                    <Form.Group className='mb-3' controlId='group-invite-ids'>
                        <Form.Label>Send Invites to:</Form.Label>
                        <Form.Control required type='text' placeholder='Enter user IDs separated by spaces...'
                            value={userInput} onChange={e => { setUserInput(e.target.value) }}
                        />
                        <Form.Text>
                            <p className='form-instructions'>
                                Enter the user IDs of the users you want to invite separated by spaces, <br />
                                e.g. 8 14 22 6 15
                            </p>
                        </Form.Text>
                    </Form.Group>

                    <div className='buttons-div'>
                        <Button className='cancel-button' variant='secondary' onClick={onHide}>
                            Cancel
                        </Button>
                        <Button className='invite-button default-button-color' type='submit'>
                            Invite
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
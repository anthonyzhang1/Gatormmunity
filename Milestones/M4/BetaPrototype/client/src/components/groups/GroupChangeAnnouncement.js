import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ERROR_STATUS, SUCCESS_STATUS } from '../Constants';

export default function GroupChangeAnnouncementModal(props) {
    const { show, onHide, groupId, userId } = props;
    const [announcement, setAnnouncement] = useState(""); // contains the user's input
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the new announcement's text to the back end for them to update the database with.
     * 
     * The front end sends:
     * announcement: {string} The new announcement's text. It may be from 0-5'000 characters long.
     * groupId: {int} The id of the group whose announcement is being changed. Must be a positive integer.
     * userId: {int} The id of the user making the change. Must be a positive integer.
     */
    async function changeAnnouncement(e) {
        e.preventDefault();

        await fetch('/api/groups/change-announcement', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                announcement: announcement,
                groupId: groupId,
                userId: userId
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /* Refresh the page on successful announcement change, and show an error if an error occurred. */
    useEffect(() => {
        if (returnData?.status === SUCCESS_STATUS) window.location.reload();
        else if (returnData?.status === ERROR_STATUS) alert(returnData.message);
    }, [returnData]);

    return (
        <Modal dialogClassName='group-change-announcement-modal' show={show} onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter" centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Change Announcement</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={changeAnnouncement}>
                    {/* Announcement Field */}
                    <Form.Group className='mb-3' controlId='group-change-announcement'>
                        <Form.Label>New Announcement</Form.Label>
                        <Form.Control as='textarea' rows={9} placeholder='Enter the new announcement...'
                            value={announcement} onChange={e => setAnnouncement(e.target.value)}
                        />
                    </Form.Group>

                    <div className='buttons-div'>
                        <Button className='cancel-button' variant='secondary' onClick={onHide}>Cancel</Button>
                        <Button className='change-button default-button-color' type='submit'>Change</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
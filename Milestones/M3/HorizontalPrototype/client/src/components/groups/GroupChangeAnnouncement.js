import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function GroupChangeAnnouncementModal(props) {
    // groupId: the id of the group to change the announcement of
    const { show, onHide } = props;
    const [announcement, setAnnouncement] = useState(""); // contains the user's input
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the new announcement's text to the back end for them to update the database with.
     * 
     * The front end sends:
     * announcement: string with the new announcement's text. It may be 0-5000 characters long.
     * groupId: int containing the id of the group whose announcement is being changed.
     */
    async function changeAnnouncement(e) {
        e.preventDefault();
        
        setReturnData({ status: "success" });

        /* TODO: Implement in M4. */
        // await fetch('/api/groups/change-announcement', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         announcement: announcement,
        //         groupId: groupId
        //     })
        // })
        //     .then(res => res.json())
        //     .then(data => { setReturnData(data); }) // store what the backend sent to us
        //     .catch(console.log());
    }

    /* Display the success message and hide the modal on form submission. */
    useEffect(() => {
        if (returnData?.status === "success") {
            alert("Announcement changed!");
            setAnnouncement(""); // clear form
            onHide(); // hide the modal
            setReturnData(null); // clear the return data
        }
    }, [returnData]); // eslint-disable-line react-hooks/exhaustive-deps

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
                            value={announcement} onChange={e => { setAnnouncement(e.target.value) }}
                        />
                    </Form.Group>

                    <div className='buttons-div'>
                        <Button className='cancel-button' variant='secondary' onClick={onHide}>
                            Cancel
                        </Button>
                        <Button className='change-button default-button-color' type='submit'>
                            Change
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
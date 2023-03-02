import { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function ChangeProfilePictureModal(props) {
    // userId: the id of the user to change the profile picture of
    const { userId, show, onHide } = props;
    const profilePictureInput = useRef();

    const [profilePicture, setProfilePicture] = useState(null); // stores the user's new profile picture
    const [returnData, setReturnData] = useState(null); // stores the data sent from the backend

    /** 
     * Sends the new profile picture of the user to the back end. The back end should check that `userId` is an actual user's id.
     * 
     * The front end sends:
     * profilePicture: File with the user's new profile picture. It is required, must be JPEG, PNG, WebP, GIF, or AVIF,
     *     and be 5 MB at most.
     * userId: int with the id of the user whose profile picture is being changed.
     */
    async function changeProfilePicture(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('profilePicture', profilePicture);

        await fetch('/api/users/change-profile-picture', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => { setReturnData(data); }) // store what the backend sent to us
            .catch(console.log());
    }

    /* Refreshes the user's profile page on success. Otherwise, show an error. */
    useEffect(() => {
        if (returnData?.status === 'success') {
            alert("Your profile picture was successfully changed. Please log out and log back in to see the new picture.");
            window.location.reload();
        } else if (returnData?.status === 'error') {
            alert(returnData.message);
        }
    }, [returnData]);

    return (
        <Modal dialogClassName='change-profile-picture-modal' show={show} onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter" centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Change Profile Picture</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={changeProfilePicture}>
                    {/* Profile Picture Field */}
                    <Form.Group className='mb-3' controlId='change-profile-picture-field'>
                        <Form.Control required type='file' name='profilePicture' ref={profilePictureInput}
                            onChange={e => { setProfilePicture(e.target.files[0]) }}
                        />
                        <Form.Text>
                            <p className='form-instructions'>
                                Upload your new profile picture. Accepted image formats are: JPEG, PNG, WebP, GIF, and AVIF.
                                Max 5 MB file size.
                            </p>
                        </Form.Text>
                    </Form.Group>

                    <div className='buttons-div'>
                        <Button className='cancel-button' variant='secondary' onClick={onHide}>
                            Cancel
                        </Button>
                        <Button className='upload-button default-button-color' type='submit'>
                            Upload
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
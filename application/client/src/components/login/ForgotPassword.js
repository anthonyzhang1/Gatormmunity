/* This file holds the component which displays a modal letting the user know how to reset their password.
 * The component is used in the Login page. */

import { Modal, Button } from 'react-bootstrap';

export default function ForgotPasswordModal(props) {
    const { onHide } = props;

    return (
        <Modal dialogClassName="forgot-password-modal" {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Forgot your password?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="modal-instructions">
                    If you do not remember your password, please contact us using the Contact Us link in the footer. <br /><br />
                    Provide your full name, SFSU ID number, and SFSU email in the contact form,
                    and state in your message that you wish to reset your password. <br />
                    We may contact you via email to confirm your identity before resetting your password.
                </p>

                {/* Close Button */}
                <Button className="close-button" variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Body>
        </Modal>
    );
}
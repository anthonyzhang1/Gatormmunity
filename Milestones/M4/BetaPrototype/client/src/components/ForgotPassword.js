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
                    If you do not remember your password, please contact us using the contact us link in the footer. <br />
                    Provide your full name, SFSU ID number, and SFSU email in the contact form,
                    and state in your message that you wish to reset your password. <br />
                    We will send a confirmation email before resetting your password.
                </p>

                {/* Close Button */}
				<Button className="close-button" variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Body>
        </Modal>
    );
}
import { useEffect, useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { ERROR_STATUS, SUCCESS_STATUS } from "../components/Constants";

export default function ContactUs() {
    // contains what the user entered into the form. this will be sent to the back end on form submission
    const [form, setForm] = useState({
        senderName: "",
        senderEmail: "",
        messageSubject: "",
        messageBody: ""
    });

    const [returnData, setReturnData] = useState(null); // will contain what the back end returns
    const [isSending, setSending] = useState(false); // shows the user the email is in the process of sending

    /** Handler for every attribute in the form. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /** Clears the form. */
    function clearForm() {
        setForm({ senderName: "", senderEmail: "", messageSubject: "", messageBody: "" });
    }

    /** Sends the form to the back end. */
    async function submitForm(e) {
        e.preventDefault();
        setSending(true); // show the loading state

        await fetch("/api/contact-us", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(response => response.json())
            .then(data => {
                setReturnData(data);
                setSending(false);
            })
            .catch(console.log());
    }

    /* If the email was successfully sent, clear the contact us form. */
    useEffect(() => {
        if (returnData?.status === SUCCESS_STATUS) {
            alert("Email sent!");
            clearForm();
        } else if (returnData?.status === ERROR_STATUS) {
            alert("An error occurred sending your email. Please try again.");
        }
    }, [returnData]);

    return (
        <div className="contact-us-page">
            <h2 className='page-title'>Contact Us</h2>

            <p className="page-description">
                We would greatly appreciate any feedback you have about Gatormmunity. <br />

                If you would like to contact the developers for any reason (including bug reporting, reporting a user, etc.),
                please fill out the form below and submit it to send us an email. We may follow up on your message using
                the email you provided in the form.
            </p>

            <Form className="contact-form" onSubmit={submitForm}>
                {/* Sender's Name Field */}
                <Form.Group className='mb-3' controlId='contact-sender-name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control className="input-fields" required type='text' placeholder='Enter your name...'
                        value={form.senderName} onChange={e => updateForm({ senderName: e.target.value })}
                    />
                </Form.Group>

                {/* Sender's Email Field */}
                <Form.Group className='mb-3' controlId='contact-sender-email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control className="input-fields" required type='email' placeholder='Enter your email...'
                        value={form.senderEmail} onChange={e => updateForm({ senderEmail: e.target.value })}
                    />
                </Form.Group>

                {/* Optional Message Subject Field */}
                <Form.Group className='mb-3' controlId='contact-message-subject'>
                    <Form.Label>Message Subject (Optional)</Form.Label>
                    <Form.Control className="input-fields" type='text' placeholder='Enter the subject of your message...'
                        value={form.messageSubject} onChange={e => updateForm({ messageSubject: e.target.value })}
                    />
                </Form.Group>

                {/* Message Body Field */}
                <Form.Group className='mb-3' controlId='contact-message-body'>
                    <Form.Label>Message Body</Form.Label>
                    <Form.Control className="input-fields" required as='textarea' rows={5} value={form.messageBody}
                        placeholder='Enter the body of your message...'
                        onChange={e => updateForm({ messageBody: e.target.value })}
                    />
                </Form.Group>

                <Button className="submit-button default-button-color" type="submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Submit"}
                </Button>
            </Form>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

/** This component lets users log in from the home page. */
export default function LoginModal(props) {
    // contains the form's data
    const [form, setForm] = useState({
        sfsu_id_number: '',
        password: ''
    });

    // stores the data sent from the backend
    const [result, setResult] = useState(null);

    /** Updates the login form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /** Clears the login form. */
    function clearForm() {
        setForm({ sfsu_id_number: '', password: '' });
    }

    /** 
     * Sends the login form to the backend containing the credentials that the user entered.
     * 
     * The front end sends:
     * sfsu_id_number: string with the entered SFSU ID number.
     * password: string with the entered password in plaintext.
     */
    async function onSubmit(e) {
        e.preventDefault();

        // send the form to the backend, then wait for their response to us
        await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => { setResult(data); }) // store what the backend sent to us
            .catch(console.log());
    }

    /* Closes the modal and refreshes the current page upon successful login. */
    useEffect(() => {
        if (result?.status === 'success') {
            window.location.reload(); // refresh the page
        }
    }, [result]);

    /** For M2 only: Alert the user if they click on a button that should redirect them to a page that is not the home page. */
    function M2RedirectAlert() {
        alert("You clicked on a link that will take you to another page. That page will be implemented in Milestone 3!");
    }

    return (
        <Modal className='login-modal-component' {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Displays the success/error message from the backend. */}
                <h5>{result?.message}</h5>

                <Form onSubmit={onSubmit}>
                    {/* SFSU ID Number Field */}
                    <Form.Group className='mb-3' controlId='sfsu-id-number'>
                        <Form.Label>SFSU ID Number</Form.Label>
                        <Form.Control required type='number' placeholder='SFSU ID Number' value={form.sfsu_id_number}
                            onChange={e => updateForm({ sfsu_id_number: e.target.value })}
                        />
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className='mb-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type='password' placeholder='Password' value={form.password}
                            onChange={e => updateForm({ password: e.target.value })}
                        />
                    </Form.Group>

                    {/* Forgot password option */}
                    <Link to='#' className='forgot-password mb-4' onClick={M2RedirectAlert}>Forgot your password?</Link>

                    <Button className='clear-form-button' variant='secondary' onClick={clearForm}>
                        Clear Form
                    </Button>
                    <Button className='login-button default-button-color' variant='primary' type='submit'>
                        Login
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
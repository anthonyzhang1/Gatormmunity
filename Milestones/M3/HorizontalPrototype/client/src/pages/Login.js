import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import ForgotPasswordModal from '../components/ForgotPassword';

/** This component lets users log in from the home page. */
export default function Login() {
    const navigate = useNavigate();

    // Determines whether to show or hide the forgot password modal
    const [forgotPasswordShow, setForgotPasswordShow] = useState(false);

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

    /* Redirects to the dashboard page upon successful login. */
    useEffect(() => {
        if (result?.status === 'success') {
            navigate('/dashboard');
            window.location.reload(); // refresh the page after redirect to update the navbar
        }
    }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='login-page'>
            <h2 className='page-title'>Login</h2>

            {/* Displays the error message from the backend. */}
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

                <Button className='login-button default-button-color' type='submit'>
                    Login
                </Button>

                {/* Forgot password link */}
                <Link className='forgot-password-link mb-3' onClick={() => setForgotPasswordShow(true)}>
                    Forgot your password?
                </Link>

                {/* Register for account link */}
                <Link className='registration-link mb-5' to='/register'>
                    Don't have an account yet?
                </Link>

                {/* Displays/hides the forgot password modal. */}
                <ForgotPasswordModal show={forgotPasswordShow} onHide={() => setForgotPasswordShow(false)} />
            </Form>
        </div>
    );
}
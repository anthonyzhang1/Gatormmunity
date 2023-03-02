/* This file handles the display of the Login page, which lets users log into their account. Users already logged in
 * will not be able to log in again. */

import { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';
import ForgotPasswordModal from '../components/login/ForgotPassword';

export default function Login() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    const [passwordHidden, setPasswordHidden] = useState(true); // determines whether the password is hidden or visible
    const [forgotPasswordShow, setForgotPasswordShow] = useState(false); // shows/hides the forgot password modal
    const [result, setResult] = useState(null); // stores the data sent by the backend

    // contains the form's data
    const [form, setForm] = useState({
        sfsuIdNumber: '',
        password: ''
    });

    /** Updates the login form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /** 
     * Sends the login form to the back end containing the credentials that the user entered.
     * 
     * Fetch Request's Body:
     * sfsuIdNumber: {string} The entered SFSU ID number.
     * password: {string} The entered password in plaintext.
     */
    function login(e) {
        e.preventDefault();

        fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(console.log());
    }

    /* Redirects to the dashboard page upon successful login, or shows an error in an alert. */
    useEffect(() => {
        if (result?.status === SUCCESS_STATUS) {
            navigate('/dashboard');
            window.location.reload(); // refresh the page after redirect to keep the user on the dashboard page
        } else if (result?.status === ERROR_STATUS) {
            alert(result.message);
        }
    }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (userSession.isLoggedIn) return <h1 className='page-title'>You are already logged in!</h1>; // already logged in
    else return (
        <div className='login-page'>
            <h2 className='page-title'>Login</h2>

            <Form onSubmit={login}>
                {/* SFSU ID Number Field */}
                <Form.Group className='mb-3' controlId='login-sfsu-id-number'>
                    <Form.Label>SFSU ID Number</Form.Label>
                    <Form.Control required type='number' placeholder='SFSU ID Number' value={form.sfsuIdNumber}
                        onChange={e => updateForm({ sfsuIdNumber: e.target.value })}
                    />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className='mb-3' controlId='login-password'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        {/* The password is hidden/visible depending on whether the user pressed the eye icon. */}
                        <Form.Control className='password-field' required type={passwordHidden ? "password" : "text"}
                            placeholder='Password' value={form.password} onChange={e => updateForm({ password: e.target.value })}
                        />
                        
                        <div className='eye-container' onClick={() => setPasswordHidden(!passwordHidden)}>
                            <img className='eye-icon' src="/images/assets/showPasswordEye.png"
                                alt="password eye" width="35" height="40"
                            />
                        </div>
                    </InputGroup>
                </Form.Group>

                <Button className='login-button default-button-color' type='submit'>Login</Button>

                {/* Forgot password link */}
                <Link className='forgot-password-link mb-3' onClick={() => setForgotPasswordShow(true)}>
                    Forgot your password?
                </Link>

                {/* Register for account link */}
                <Link className='registration-link mb-5' to='/register'>Don't have an account yet?</Link>

                {/* Displays/hides the forgot password modal. */}
                <ForgotPasswordModal show={forgotPasswordShow} onHide={() => setForgotPasswordShow(false)} />
            </Form>
        </div>
    );
}
import { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import ForgotPasswordModal from '../components/ForgotPassword';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';

/** This component lets users log in from the home page. */
export default function Login() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    const [passwordHidden, setPasswordHidden] = useState(true); // determines whether the password is hidden or in plaintext
    const [forgotPasswordShow, setForgotPasswordShow] = useState(false); // shows/hides the forgot password modal
    const [result, setResult] = useState(null); // stores the data sent from the backend

    // contains the form's data
    const [form, setForm] = useState({
        sfsu_id_number: '',
        password: ''
    });

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
    else if (userSession.isLoggedIn) return <h1 className='page-title'>You are already logged in!</h1>;
    else return (
        <div className='login-page'>
            <h2 className='page-title'>Login</h2>

            <Form onSubmit={onSubmit}>
                {/* SFSU ID Number Field */}
                <Form.Group className='mb-3' controlId='login-sfsu-id-number'>
                    <Form.Label>SFSU ID Number</Form.Label>
                    <Form.Control required type='number' placeholder='SFSU ID Number' value={form.sfsu_id_number}
                        onChange={e => updateForm({ sfsu_id_number: e.target.value })}
                    />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className='mb-3' controlId='login-password'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
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
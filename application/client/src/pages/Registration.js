/* This file handles the display of the Registration page, which lets people register for an account.
 * On Gatormmunity, one must provide their name, SFSU email, SFSU ID number, and SFSU ID card to register.
 * This is so we can verify the identity of those who wish to use our service. */

import { useEffect, useRef, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants';

export default function Registration() {
    const navigate = useNavigate();
    const sfsuIdPictureInput = useRef();
    
    // contains the form's data
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        sfsuIdNumber: '',
        password: ''
    });

    const [passwordHidden, setPasswordHidden] = useState(true); // determines whether the password is hidden or visible
    const [sfsuIdPicture, setSfsuIdPicture] = useState(null); // stores the picture of the user's SFSU ID card
    const [result, setResult] = useState(null); // stores the data sent by the backend

    /** Updates the registration form. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /**
     * Sends the registration form to the back end for them to handle.
     * 
     * Fetch Request's Body:
     * fullName: {string} The user's full name. It must be 1-100 characters long.
     * email: {string} The user's SFSU email. It must be in the form xxx@xxx.xxx, end with "sfsu.edu",
     *     and be 1-255 characters long.
     * sfsuIdNumber: {string} The user's SFSU ID number. It must be 9 characters long, and be an integer.
     * password: {string} The user's password, in plaintext. It must be 6-64 characters long.
     * sfsuIdPicture: {File} The user's SFSU ID card picture. It is required, must be JPEG, PNG, WebP, GIF, or AVIF,
     *     and must be 5 MB at most.
     */
    function register(e) {
        e.preventDefault();

        // `formData` is the form we send to the backend containing the user's credentials.
        const formData = new FormData();

        // append the form's text to `formData`
        for (const index in form) formData.append(index, form[index]);
        formData.append('sfsuIdPicture', sfsuIdPicture);

        fetch('/api/users/register', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(console.log());
    }

    /* On successful registration, show a message and navigate to the home page. Otherwise, show an error message. */
    useEffect(() => {
        if (result?.status === SUCCESS_STATUS) { // successful registration
            alert("Thank you for registering. We are now verifying your identity, so please try logging in later!");
            navigate('/');
        } else if (result?.status === ERROR_STATUS) { // failed registration
            alert(result.message);
        }
    }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='registration-page'>
            <h2 className='page-title'>Registration</h2>

            <Form onSubmit={register}>
                {/* Full Name Field */}
                <Form.Group className='mb-3' controlId='registration-full-name'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control required type='text' placeholder='Full Name, e.g. Katla Larchica'
                        value={form.fullName} onChange={e => updateForm({ fullName: e.target.value })}
                    />
                </Form.Group>

                {/* Email Field */}
                <Form.Group className='mb-3' controlId='registration-email'>
                    <Form.Label>SFSU Email</Form.Label>
                    <Form.Control required type='email' placeholder='SFSU Email, e.g. katla@sfsu.edu'
                        value={form.email} onChange={e => updateForm({ email: e.target.value })}
                    />
                </Form.Group>

                {/* SFSU ID Number Field */}
                <Form.Group className='mb-3' controlId='registration-sfsu-id-number'>
                    <Form.Label>SFSU ID Number</Form.Label>
                    <Form.Control required type='number' placeholder='SFSU ID Number (must be 9 digits)'
                        value={form.sfsuIdNumber} onChange={e => updateForm({ sfsuIdNumber: e.target.value })}
                    />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className='mb-3' controlId='registration-password'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        {/* The password is hidden/visible depending on whether the user pressed the eye icon. */}
                        <Form.Control className="password-field" required type={passwordHidden ? "password" : "text"}
                            value={form.password} placeholder='Password (must be 6+ characters of any kind)'
                            onChange={e => updateForm({ password: e.target.value })}
                        />

                        <div className='eye-container' onClick={() => setPasswordHidden(!passwordHidden)}>
                            <img className='eye-icon' src="/images/assets/showPasswordEye.png"
                                alt="password eye" width="35" height="40"
                            />
                        </div>
                    </InputGroup>
                </Form.Group>

                {/* SFSU ID Picture Field */}
                <Form.Group className='mb-4' controlId='registration-sfsu-id-picture'>
                    <Form.Label>SFSU ID Picture</Form.Label>
                    <Form.Control required type='file' name='sfsuIdPicture' ref={sfsuIdPictureInput}
                        onChange={e => setSfsuIdPicture(e.target.files[0])}
                    />
                    <Form.Text>
                        Show the front of your SFSU ID card. Accepted image formats are:
                        JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
                    </Form.Text>
                </Form.Group>

                {/* Privacy Policy and Terms of Service Checkbox */}
                <Form.Check className='registration-pp-tos-checkbox mb-1' type='checkbox' id='registration-pp-tos' required
                    label={
                        <p>
                            I accept the&nbsp;
                            <Link to='/privacy-policy' target='_blank' rel='noopener noreferrer'>privacy policy</Link>
                            &nbsp;and&nbsp;
                            <Link to='/terms-of-service' target='_blank' rel='noopener noreferrer'>terms of service</Link>.
                        </p>
                    }
                >
                </Form.Check>

                <Button className='register-button default-button-color' type='submit'>Register</Button>

                {/* Login Link */}
                <Link className="login-link mb-4" to='/login'>Already have an account?</Link>
            </Form>
        </div>
    );
}
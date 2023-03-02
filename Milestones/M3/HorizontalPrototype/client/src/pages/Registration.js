import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function Registration() {
    const navigate = useNavigate();
    const sfsuIdPictureInput = useRef();

    const [passwordHidden, setPasswordHidden] = useState(true); // determines whether the password is hidden or in plaintext

    // contains the form's data
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        sfsu_id_number: '',
        password: ''
    });
    const [sfsuIdPicture, setSfsuIdPicture] = useState(null); // stores the picture of the user's SFSU ID card
    const [result, setResult] = useState(null); // stores the data sent from the backend

    /** Updates the registration form. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /**
     * Sends the registration form to the back end so that the user can have an account.
     * The back end should validate the input.
     * 
     * The front end sends:
     * full_name: string with the user's full name. It must be 1-100 characters long.
     * email: string with the user's email. It must be in the form xxx@xxx.xxx, end with "sfsu.edu",
     *     and be 1-255 characters long.
     * sfsu_id_number: string with the user's SFSU ID number. It must be 9 characters long, and be an integer.
     * password: string with the user's plaintext password. It must be 6-64 characters long.
     * sfsu_id_picture: File with the user's SFSU ID picture. It is required, must be JPEG, PNG, WebP, GIF, or AVIF,
     *     and must be 5 MB at most.
     */
    async function register(e) {
        e.preventDefault();

        // `formData` is the form we send to the backend containing the user's credentials.
        const formData = new FormData();

        for (const index in form) { // append the form's text to `formData`
            formData.append(index, form[index]);
        }
        formData.append('sfsu_id_picture', sfsuIdPicture);

        await fetch('/api/users/register', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => { setResult(data); }) // store what the backend sent to us
            .catch(console.log());
    }

    /* On successful registration, show a message and redirect to login. Otherwise, show an error alert. */
    useEffect(() => {
        (function handleRegistration() {
            if (result?.status === "success") { // successful registration redirects to login
                alert("You have successfully registered!");
                navigate('/login');
            } else if (result?.status === "error") { // failed registration
                alert(result.message);
            }
        })();
    }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='registration-page'>
            <h2 className='page-title'>Registration</h2>

            <Form onSubmit={register}>
                {/* Full Name Field */}
                <Form.Group className='mb-3' controlId='registration-full-name'>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control required type='text' placeholder='Full Name, e.g. Katla Larchica'
                        value={form.full_name} onChange={e => updateForm({ full_name: e.target.value })}
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
                        value={form.sfsu_id_number} onChange={e => updateForm({ sfsu_id_number: e.target.value })}
                    />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className='mb-3' controlId='registration-password'>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control className="password-field " required type={passwordHidden ? "password" : "text"}
                            value={form.password} placeholder='Password (must be 6+ characters of any kind)'
                            onChange={e => updateForm({ password: e.target.value })}
                        />
                        <div className='eye-container' onClick={() => { setPasswordHidden(!passwordHidden) }}>
                            <img className='eye-icon' src="/images/assets/showPasswordEye.png"
                                alt="password eye" width="35" height="40"
                            />
                        </div>
                    </InputGroup>
                </Form.Group>

                {/* SFSU ID Picture Field */}
                <Form.Group className='mb-4' controlId='registration-sfsu-id-picture'>
                    <Form.Label>SFSU ID Picture</Form.Label>
                    <Form.Control required type='file' name='sfsu_id_picture' ref={sfsuIdPictureInput}
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

                <Button className='register-button default-button-color' type='submit'>
                    Register
                </Button>

                {/* Login Link */}
                <Link to='/login' className="login-link mb-4">Already have an account?</Link>
            </Form>
        </div>
    );
}
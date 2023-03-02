import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

/** This component lets users register for an account from the home page (or any page, really). */
export default function RegisterModal(props) {
    const topOfModal = useRef(); // used for scrolling to the top of the modal after submitting the form
    const sfsuIdPictureInput = useRef();
    const profilePictureInput = useRef();

    // contains the form's data
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        sfsu_id_number: '',
        password: '',
        confirm_password: '',
        role: '0' // default: unapproved user
    });
    const [sfsuIdPicture, setSfsuIdPicture] = useState(null); // stores the picture of the user's SFSU ID card
    const [profilePicture, setProfilePicture] = useState(null); // stores the picture of the user's profile picture
    const [result, setResult] = useState(null); // stores the message sent from the backend

    /** Updates the registration form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /** Clears the registration form. */
    function clearForm() {
        setForm({first_name: '', last_name: '', email: '', sfsu_id_number: '',
                 password: '', confirm_password: '', role: form.role });
        setSfsuIdPicture(null);
        setProfilePicture(null);
        sfsuIdPictureInput.current.value = null;
        profilePictureInput.current.value = null;
    }

    /**
     * Sends the registration form to the back end so that the user can have an account.
     * The back end should validate the input.
     * 
     * The front end sends:
     * first_name: string with the user's first name. It must be 1-100 characters long.
     * last_name: string with the user's last name. It must be 1-100 characters long.
     * email: string with the user's email. It must be in the form xxx@xxx.xxx, and be 1-255 characters long.
     * sfsu_id_number: string with the user's SFSU ID number. It must be 1-16 characters long, and be an integer.
     * password: string with the user's plaintext password. It must be 6-64 characters long.
     * confirm_password: string with the user's confirm password. It must match `password`.
     * role: string with the user's role number. It can be from '0' to '3'.
     * sfsu_id_picture: File with the user's SFSU ID picture. It is required, must be JPEG, PNG, WebP, GIF, and AVIF,
     *     and must have a max file size of 5 MB.
     * profile_picture: File with the user's profile picture. It is optional, must be JPEG, PNG, WebP, GIF, and AVIF,
     *     and must have a max file size of 5 MB.
     */
    async function register(e) {
        e.preventDefault();

        // `formData` is the form we send to the backend containing the user's credentials.
        // We use FormData because a regular form does not quite cut it when uploading files to the backend.
        const formData = new FormData();

        for (const index in form) formData.append(index, form[index]); // append the form's text to `formData`
        formData.append('sfsu_id_picture', sfsuIdPicture); // append the sfsu id picture to `formData`
        formData.append('profile_picture', profilePicture); // append the profile picture to `formData`

        await fetch('/api/users/register', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => { setResult(data); }) // store what the backend sent to us
        .catch(console.log());
    }

    /* Scroll to the top of the modal after submitting the form. And, reset the form after a successful registration. */
    useEffect(() => {
        topOfModal.current?.scrollIntoView({ block: "nearest" }); // scroll to top of modal
        if (result?.status === 'success') clearForm(); // clear the form
    }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

    /** For M2 only: Alert the user if they click on a button that should redirect them to a page that is not the home page. */
    function M2RedirectAlert() {
        alert("You clicked on a button that will take you to another page. That page will be implemented in Milestone 3!");
    }

    /** Shows a success or failure message depending on if the registration was successful or not. */
    function displayMessage() {
        if (result?.status === "success") { // successful registration
            return <h4>You have successfully registered.</h4>;
        } else if (result?.status === "error") { // failed registration
            return <h4>{result?.message}</h4>;
        }
    }

    return (
        <Modal dialogClassName='register-modal-component' {...props} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton ref={topOfModal}>
                <Modal.Title>Registration</Modal.Title>
            </Modal.Header>

            <Modal.Body className='.register-modal-body'>
                {/* Displays the success/error message from the backend */}
                {displayMessage()}

                <Form onSubmit={register}>
                    {/* First Name Field */}
                    <Form.Group className='mb-2' controlId='registration-first-name'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control required type='text' placeholder='First Name' value={form.first_name}
                            onChange={e => updateForm({ first_name: e.target.value })}
                        />
                        <Form.Text>Your first name can be at most 100 characters.</Form.Text>
                    </Form.Group>

                    {/* Last Name Field */}
                    <Form.Group className='mb-2' controlId='registration-last-name'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control required type='text' placeholder='Last Name' value={form.last_name}
                            onChange={e => updateForm({ last_name: e.target.value })}
                        />
                        <Form.Text>Your last name can be at most 100 characters.</Form.Text>
                    </Form.Group>

                    {/* Email Field */}
                    <Form.Group className='mb-2' controlId='registration-email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control required type='email' placeholder='Email Address' value={form.email}
                            onChange={e => updateForm({ email: e.target.value })}
                        />
                        <Form.Text>Your email must be in the form xxx@xxx.xxx, and be at most 255 characters.</Form.Text>
                    </Form.Group>

                    {/* SFSU ID Number Field */}
                    <Form.Group className='mb-2' controlId='registration-sfsu-id-number'>
                        <Form.Label>SFSU ID Number</Form.Label>
                        <Form.Control required type='number' placeholder='SFSU ID Number' value={form.sfsu_id_number}
                            onChange={e => updateForm({ sfsu_id_number: e.target.value })}
                        />
                        <Form.Text>Your SFSU ID number can have at most 16 digits.</Form.Text>
                    </Form.Group>

                    {/* Password Field */}
                    <Form.Group className='mb-2' controlId='registration-password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type='password' placeholder='Password' value={form.password}
                            onChange={e => updateForm({ password: e.target.value })}
                        />
                        <Form.Text>Your password must be from 6-64 characters long.</Form.Text>
                    </Form.Group>

                    {/* Confirm Password Field */}
                    <Form.Group className='mb-2' controlId='registration-confirm-password'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control required type='password' placeholder='Confirm Password' value={form.confirm_password}
                            onChange={e => updateForm({ confirm_password: e.target.value })}
                        />
                    </Form.Group>

                    {/* SFSU ID Picture Field */}
                    <Form.Group className='mb-2' controlId='registration-sfsu-id-picture'>
                        <Form.Label>SFSU ID Picture</Form.Label>
                        <Form.Control required type='file' name='sfsu_id_picture' ref={sfsuIdPictureInput}
                            onChange={e => setSfsuIdPicture(e.target.files[0])}
                        />
                        <Form.Text>
                            Show the front of your SFSU ID card. Accepted image formats are:
                            JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.
                        </Form.Text>
                    </Form.Group>

                    {/* Profile Picture Field */}
                    <Form.Group className='mb-2' controlId='registration-profile-picture'>
                        <Form.Label>Profile Picture (optional)</Form.Label>
                        <Form.Control type='file' name='profile-picture' ref={profilePictureInput}
                            onChange={e => setProfilePicture(e.target.files[0])}
                        />
                        <Form.Text>Accepted image formats are: JPEG, PNG, WebP, GIF, and AVIF. Max 5 MB file size.</Form.Text>
                    </Form.Group>

                    {/* User Role Dropdown */}
                    <Form.Group className='mb-3' controlId='registration-role'>
                        <Form.Label>Select your Role (used for the search parameter in M2's search bar):</Form.Label>
                        <Form.Select aria-label="role" value={form.role} onChange={e => updateForm({ role: e.target.value })}>
                            <option value="0">Unapproved User</option>
                            <option value="1">Approved User</option>
                            <option value="2">Moderator</option>
                            <option value="3">Administrator</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Privacy Policy and Terms of Service Checkbox */}
                    <Form.Check className='registration-pp-tos-checkbox mb-1' type={'checkbox'} id={'registration-pp-tos'}
                        required label={
                            <p>
                                I accept the <Link to='#' onClick={M2RedirectAlert}>privacy policy</Link>
                                &nbsp;and <Link to='#' onClick={M2RedirectAlert}>terms of service</Link>.
                            </p>
                        }
                    >
                    </Form.Check>

                    <Button className='clear-form-button' variant='secondary' onClick={clearForm}>
                        Clear Form
                    </Button>
                    <Button className='register-button default-button-color' variant='primary' type='submit'>
                        Register
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
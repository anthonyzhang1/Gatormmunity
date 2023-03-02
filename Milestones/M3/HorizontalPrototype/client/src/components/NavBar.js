import { useContext, useEffect, useState } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';

export default function NavBar() {
    const userSession = useContext(UserContext); // contains the user's data, if they are logged in
    const navigate = useNavigate();

    // contains the form for the search function
    const [form, setForm] = useState({
        searchTerms: '',
        role: ''
    });
    const [searchResult, setSearchResult] = useState(null); // data stored after the search fetch
    const [logoutResult, setLogoutResult] = useState(null); // data stored after the logout fetch

    /** Update the form's state. */
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    /** 
     * Send the search terms and the role filter to the backend so it can search the database.
     * 
     * The front end sends:
     * searchTerms: string with the search terms the user entered. Can be an empty string, which indicates the back end
     *     should send back users regardless of name.
     * role: string with the role the user wants to filter the search results by. Can be '', '1', '2', '3',
     *     and possibly more in the future. If role is an empty string, then no role filter was applied.
     */
    async function search(e) {
        e.preventDefault();

        await fetch('/api/users/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => setSearchResult(data))
            .catch(console.log());
    }

    /**
     * Asks the back end to log the user out via a GET request.
     * 
     * The front end expects:
     * If the logout succeeded:
     *     status: "success".
     * If the logout failed:
     *     status: "error".
     */
    async function logout() {
        await fetch("/api/users/logout")
            .then(res => res.json())
            .then(data => { setLogoutResult(data); }) // store what the back end sent to us
            .catch(console.log());
    }

    /** The logo's redirect link changes depending on if you are logged in or not.
      * Users not logged in are redirected to the home page, while logged in users are redirected to the dashboard. */
    function logoRedirect() {
        if (userSession) return navigate('/dashboard');
        else return navigate('/');
    }

    /* Send search results to the search results page on success, or show an error on error. */
    useEffect(() => {
        // on successful search, navigate to the search results page and send the data over
        if (searchResult?.status === 'success') {
            navigate('/search', {
                state: {
                    userSearchResult: searchResult,
                    searchTerms: form.searchTerms,
                    roleFilter: form.role
                }
            });
        } else if (searchResult?.status === 'error') { // alert on search error
            alert(searchResult.message);
        }
    }, [searchResult]); // eslint-disable-line react-hooks/exhaustive-deps

    // Navigate to the home page on successful logout, or display an alert if the logout failed
    useEffect(() => {
        if (logoutResult?.status === "success") {
            navigate('/');
            window.location.reload(); // refresh the page to update the navbar
        } else if (logoutResult?.status === "error") {
            alert("Your logout failed due to a server error.");
        }
    }, [logoutResult]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Navbar className='navbar-component'>
            <Container className='navbar-container' fluid>
                {/* Navbar logo */}
                <Navbar.Brand className='navbar-logo' onClick={logoRedirect}>
                    <img src="/images/assets/gatorFrontLogo.png" width="45" height="45" alt="gatormmunity logo" />
                </Navbar.Brand>

                {/* Navbar Left Buttons */}
                <Navbar.Collapse className='navbar-left'>
                    {/* Only display the buttons to the pages if the user is logged in */}
                    {userSession && <>
                        <Nav.Link href='/forums' className='navbar-text'>Forums</Nav.Link>
                        <Nav.Link href='/marketplace' className='navbar-text'>Market</Nav.Link>
                        <Nav.Link href='/groups' className='navbar-text'>Groups</Nav.Link>
                        <Nav.Link href='/chat' className='navbar-text'>Chat</Nav.Link>
                        <Nav.Link href='/inbox' className='navbar-text'>Inbox</Nav.Link>
                    </>}

                    {/* Display some text if the user is not logged in so the navbar is not as empty */}
                    {!userSession &&
                        <Nav.Link href="/" className="navbar-text">
                            Gatormmunity
                        </Nav.Link>
                    }
                </Navbar.Collapse>

                {/* Navbar right side: including search bar, profile pic, and login/register/logout buttons */}
                <Navbar.Collapse className='navbar-right justify-content-end'>
                    <Form className='navbar-search-form d-flex justify-content-end' onSubmit={search}>
                        {/* The search bar */}
                        <Form.Control className='navbar-search-bar me-1' type='search' value={form.searchTerms}
                            placeholder={userSession ? "Search Gatormmunity..." : "Search for users..."}
                            onChange={e => updateForm({ searchTerms: e.target.value })}
                        />

                        {/* Show the search results in a modal */}
                        <Button className='search-button me-4' type='submit'>
                            <img className='search-icon' src="/images/assets/searchIcon.png" alt="search icon"
                                height="22" width="22"
                            />
                        </Button>
                    </Form>

                    {/* Show the user's profile picture and log out button if the user is logged in. */}
                    {userSession && <>
                        <Link to={`/user/${userSession.user_id}`}>
                            <img className="navbar-profile-picture" src={userSession.profile_picture_thumbnail_path}
                                width="45" height="45" alt="profile thumbnail"
                            />
                        </Link>

                        <Navbar.Text className='navbar-text' onClick={() => logout()}>
                            Logout
                        </Navbar.Text>
                    </>}

                    {/* Show the login and registration button if the user is not logged in. */}
                    {!userSession && <>
                        <Nav.Link className='navbar-text' href="/login">
                            Login
                        </Nav.Link>

                        <Nav.Link className='navbar-text' href="/register">
                            Register
                        </Nav.Link>
                    </>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
import { forwardRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Dropdown, Form, Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from './Constants.js';

export default function NavBar() {
    const userSession = useContext(UserContext); // contains the user's session data
    const navigate = useNavigate();

    const [searchTerms, setSearchTerms] = useState("");
    const [logoutResult, setLogoutResult] = useState(null); // data stored after the logout fetch

    /** Replaces the dropdown button with the user's profile picture. */
    const ProfilePictureToggle = forwardRef(({ onClick }, ref) => (
        <img src={`/${userSession.profile_picture_thumbnail_path}`} alt="profile thumbnail" width="45" height="45"
            onClick={(e) => onClick(e)} ref={ref}
        />
    ));

    /** Navigates to the search page with the search terms entered, if there were any. */
    function goToSearchPage(e) {
        e.preventDefault();
        searchTerms.length ? navigate(`/search/${searchTerms}`) : navigate('/search');
    }

    /**
     * Asks the back end to log the user out via a GET request.
     * 
     * The front end expects:
     * If the logout succeeded:
     *     status: {string} "success".
     * If the logout failed:
     *     status: {string} "error".
     */
    async function logout() {
        await fetch("/api/users/logout")
            .then(res => res.json())
            .then(data => setLogoutResult(data))
            .catch(console.log());
    }

    /* Navigate to the home page on successful logout, or display an alert if the logout failed. */
    useEffect(() => {
        if (logoutResult?.status === SUCCESS_STATUS) {
            navigate('/');
            window.location.reload(); // refresh the page to update the navbar
        } else if (logoutResult?.status === ERROR_STATUS) {
            alert("Your logout failed due to a server error.");
        }
    }, [logoutResult]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Navbar className='navbar-component'>
            <Container className='navbar-container' fluid>
                {/* Navbar Logo */}
                <Navbar.Brand className='navbar-logo' onClick={() => navigate("/")}>
                    <img src="/images/assets/gatorFrontLogo.png" width="45" height="45" alt="gatormmunity logo" />
                </Navbar.Brand>

                {/* Navbar Left Buttons */}
                <Navbar.Collapse className='navbar-left'>
                    {/* Only display the buttons to the pages if the user is logged in. */}
                    {userSession?.isLoggedIn && <>
                        <Nav.Link className='navbar-text' href='/forums'>Forums</Nav.Link>
                        <Nav.Link className='navbar-text' href='/marketplace'>Market</Nav.Link>
                        <Nav.Link className='navbar-text' href='/groups'>Groups</Nav.Link>
                        <Nav.Link className='navbar-text' href='/chat'>Chat</Nav.Link>
                        <Nav.Link className='navbar-text' href='/inbox'>Inbox</Nav.Link>
                        {userSession.role >= 2 && <Nav.Link className='navbar-text' href='/admin'>Admin</Nav.Link>}
                    </>}

                    {/* Display some text if the user is not logged in so the navbar is not as empty */}
                    {!userSession?.isLoggedIn && <Nav.Link href="/" className="navbar-text">Gatormmunity</Nav.Link>}
                </Navbar.Collapse>

                {/* Navbar right side: including search bar, profile pic, and login/register buttons */}
                <Navbar.Collapse className='navbar-right'>
                    <Form className='navbar-search-form' onSubmit={goToSearchPage}>
                        {/* The search bar */}
                        <Form.Control className='navbar-search-bar' type='search' value={searchTerms}
                            placeholder={userSession?.isLoggedIn ? "Search for users, listings, or threads..."
                                : "Search for users..."
                            }
                            onChange={e => setSearchTerms(e.target.value)}
                        />

                        {/* The search button */}
                        <Button className='search-button' type='submit'>
                            <img className='search-icon' src="/images/assets/searchIcon.png" alt="search icon"
                                height="22" width="22"
                            />
                        </Button>
                    </Form>

                    {/* Show the profile picture and its dropdown if the user is logged in. */}
                    {userSession?.isLoggedIn && <Dropdown className='profile-picture-dropdown'>
                        <Dropdown.Toggle as={ProfilePictureToggle} />

                        <Dropdown.Menu className='dropdown-menu-end'>
                            <Dropdown.Item href='/dashboard'>Dashboard</Dropdown.Item>
                            <Dropdown.Item href={`/user/${userSession.user_id}`}>Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => logout()} >Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>}

                    {/* Show the login and registration button if the user is not logged in. */}
                    {!userSession?.isLoggedIn && <>
                        <Nav.Link className='navbar-text login-button' href="/login">Login</Nav.Link>
                        <Nav.Link className='navbar-text' href="/register">Register</Nav.Link>
                    </>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
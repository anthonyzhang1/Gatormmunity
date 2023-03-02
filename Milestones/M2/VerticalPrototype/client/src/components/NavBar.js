import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { UserContext } from '../App.js';
import LoginModal from './LoginModal.js';
import RegisterModal from './RegisterModal.js';
import SearchResultsModal from './SearchResultsModal.js';

export default function NavBar() {
    const userSession = useContext(UserContext); // contains the user's data, if they are logged in

    /* States for determining whether to show or hide a modal */
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [searchResultsModalShow, setSearchResultsModalShow] = useState(false);

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

    /** Clears the search bar. */
    function clearSearchBar() {
        setForm({ searchTerms: '', role: form.role });
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
            .then(data => { setSearchResult(data); }) // store what the backend sent back
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

    // Display the error message if an error occurred when the back end performed the search
    useEffect(() => {
        if (searchResult?.status === 'error') {
            alert(searchResult.message);
        }
    }, [searchResult]);

    // Refresh the page on successful logout, or display an alert if the logout failed
    useEffect(() => {
        if (logoutResult?.status === "success") {
            window.location.reload(); // refresh the page
        } else if (logoutResult?.status === "error") {
            alert("Your logout failed due to a server error.");
        }
    }, [logoutResult])

    /** For M2 only: Alert the user if they click on a button that should redirect them to a page that is not the home page. */
    function M2RedirectAlert() {
        alert("You clicked on a button that will take you to another page. That page will be implemented in Milestone 3!");
    }

    /** Clear the search bar and the search results modal after closing it. */
    function handleSearchResultsModalClose() {
        setSearchResultsModalShow(false);
        setSearchResult(null);
        clearSearchBar();
    }

    return (
        <Navbar className='navbar-component'>
            <Container className='navbar-container' fluid>
                {/* Navbar logo */}
                <Navbar.Brand className='navbar-logo' href='/'>
                    <img src="images/assets/gatorFrontLogo.png" width="45" height="45" alt="" />
                </Navbar.Brand>

                {/* Navbar Left Buttons */}
                <Navbar.Collapse className='navbar-left'>
                    {/* Only display the buttons to the pages if the user is logged in */}
                    {userSession && <>
                        <Nav.Link href='#' className='navbar-text' onClick={M2RedirectAlert}>Forums</Nav.Link>
                        <Nav.Link href='#' className='navbar-text' onClick={M2RedirectAlert}>Marketplace</Nav.Link>
                        <Nav.Link href='#' className='navbar-text' onClick={M2RedirectAlert}>Groups</Nav.Link>
                        <Nav.Link href='#' className='navbar-text' onClick={M2RedirectAlert}>Chat</Nav.Link>
                        <Nav.Link href='#' className='navbar-text' onClick={M2RedirectAlert}>Inbox</Nav.Link>
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
                        <Form.Control className='navbar-search-bar me-1' type='search'
                            placeholder='Search for users...' value={form.searchTerms}
                            onChange={e => updateForm({ searchTerms: e.target.value })}
                        />

                        {/* Dropdown for the role filter */}
                        <Form.Group className='navbar-search-select me-2' controlId='search-role'>
                            <Form.Select aria-label="role" value={form.role}
                                onChange={e => updateForm({ role: e.target.value })}
                            >
                                <option value=''>Filter by Role</option> {/* Search in all roles */}
                                <option value='1'>Approved Users</option> {/* Search only approved users */}
                                <option value='2'>Moderators</option> {/* Search only moderators */}
                                <option value='3'>Administrators</option> {/* Search only administrators */}
                            </Form.Select>
                        </Form.Group>

                        {/* Show the search results in a modal */}
                        <Button className='default-button-color me-3' variant='primary' type='submit'
                            onClick={() => setSearchResultsModalShow(true)}
                        >
                            Search
                        </Button>
                    </Form>

                    {/* Show the login button if the user is not logged in. */}
                    {!userSession && <Navbar.Text className='navbar-text' onClick={() => setLoginModalShow(true)}>
                        Login
                    </Navbar.Text>}

                    {/* Show the registration button if the user is not logged in. */}
                    {!userSession && <Navbar.Text className='navbar-text' onClick={() => setRegisterModalShow(true)}>
                        Register
                    </Navbar.Text>}

                    {/* Show the user's profile picture if the user is logged in. */}
                    {userSession &&
                        <Link to='#' onClick={M2RedirectAlert}>
                            <img className="navbar-profile-picture" src={userSession.profile_picture_thumbnail_path}
                                width="45" height="45" alt="profile thumbnail"
                            />
                        </Link>
                    }

                    {/* Show the logout button if the user is logged in. */}
                    {userSession && <Navbar.Text className='navbar-text' onClick={() => logout()}>
                        Logout
                    </Navbar.Text>}

                    {/* Displays/hides the various modals. */}
                    <LoginModal show={loginModalShow} onHide={() => setLoginModalShow(false)} />
                    <RegisterModal show={registerModalShow} onHide={() => setRegisterModalShow(false)} />
                    <SearchResultsModal show={searchResultsModalShow} onHide={() => handleSearchResultsModalClose()}
                        searchTerms={form.searchTerms} roleFilter={form.role} searchResult={searchResult}
                    />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
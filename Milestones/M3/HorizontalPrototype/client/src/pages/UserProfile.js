import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import ActivityRow from '../components/profile/ProfileActivityRow';
import ChangePictureModal from '../components/profile/ChangeProfilePicture.js';
import { mockListings, mockThreads, mockUsers } from '../components/M3MockData';

export default function UserProfile() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { userId } = useParams(); // userId in the URL
    userId = parseInt(userId); // converts userId from a string to an int

    const [changePictureModalShow, setChangePictureModalShow] = useState(false); // shows/hides the change picture modal

    const hardcodedUser = mockUsers.find(user => user.user_id === userId); // can be undefined
    /** Determines whether to show hardcoded data or the logged in users' data.
      * The value is automatically assigned a value later. */
    let showHardcodedData = true;

    /** Converts a role from an integer enum to a human-readable string. */
    function displayRole() {
        const role = showHardcodedData ? hardcodedUser?.role : userSession?.role;
        switch (role) {
            case 0: return "Unapproved User";
            case 1: return "Approved User";
            case 2: return "Moderator";
            case 3: return "Administrator";
            default: return "None";
        }
    }

    function displayJoinDate() {
        const joinDate = showHardcodedData ? hardcodedUser?.join_date : userSession?.join_date;
        return new Date(joinDate).toLocaleDateString();
    }

    function getFirstName() {
        return showHardcodedData ? hardcodedUser?.full_name.split(" ")[0] + "'s" : "Your";
    }

    /* TODO: should fetch backend data for given userId in M4 */

    // Display the user's profile page if the user wants to see their own profile page, otherwise show a hardcoded's user's page
    if (userSession?.user_id === userId) showHardcodedData = false
    else showHardcodedData = true;

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else if (showHardcodedData && !hardcodedUser) {
        return <h1 className='page-title'>This user does not exist.</h1>
    } else return (
        <div className='user-profile-page'>
            <Container className="profile-container" fluid>
                <Row>
                    <Col className='user-col' md="auto">
                        <img className='profile-pic' alt="user's pfp" height="300" width="300"
                            src={showHardcodedData ? hardcodedUser?.profile_picture_path : userSession?.profile_picture_path}
                        />

                        <p className="name">
                            {showHardcodedData ? hardcodedUser?.full_name :
                                `${userSession?.first_name} ${userSession?.last_name}`}
                        </p>
                        <p className="role">Role: {displayRole()}</p>
                        <p className="join-date">Joined: {displayJoinDate()}</p>

                        {showHardcodedData &&
                            <Button className='send-message-button default-button-color' onClick={() => navigate("/inbox")}>
                                Send Message
                            </Button>
                        }
                    </Col>

                    {/* Only show the edit profile picture icon on the user's own profile page. */}
                    {!showHardcodedData &&
                        <Col className='edit-picture-col' md='auto'>
                            <img className='edit-icon' src='/images/assets/editIcon.png' alt='edit pencil'
                                height='30' width='30' onClick={() => setChangePictureModalShow(true)}
                            />
                        </Col>
                    }

                    <Col className="activity-table-col">
                        <div className="activity-table-div">
                            <h4 className='table-title'>{getFirstName()} Recent Activity</h4>

                            <ActivityRow activity="thread" title={mockThreads[10].title} link="/thread/10" />
                            <ActivityRow activity="listing" title={mockListings[6].name} link='/listing/6' />
                            <ActivityRow activity="thread" title={mockThreads[6].title} link="/thread/6" />
                            <ActivityRow activity="post" title={mockThreads[4].title} link="/thread/4" />
                            <ActivityRow activity="post" title={mockThreads[1].title} link="/thread/1" />
                            <ActivityRow activity="thread" title={mockThreads[1].title} link="/thread/1" />
                            <ActivityRow activity="listing" title={mockListings[2].name} link='/listing/2' />
                            <ActivityRow activity="listing" title={mockListings[1].name} link="/listing/1" />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Displays/hides the modals. */}
            <ChangePictureModal show={changePictureModalShow} onHide={() => setChangePictureModalShow(false)} userId={userId} />
        </div>
    );
}
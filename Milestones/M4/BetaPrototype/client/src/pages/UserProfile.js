import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import ActivityRow from '../components/profile/ProfileActivityRow';
import ChangePictureModal from '../components/profile/ChangeProfilePicture.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';

export default function UserProfile() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { userId } = useParams(); // userId in the URL
    userId = parseInt(userId); // converts userId from a string to an int

    /** Stores whether the profile page being displayed is the user's own profile page. */
    const isOwnProfilePage = userId === userSession?.user_id;

    const [changePictureModalShow, setChangePictureModalShow] = useState(false); // shows/hides the change picture modal
    const [userData, setUserData] = useState(null); // stores the user profile data sent from the backend
    const [conversationData, setConversationData] = useState(null); // stores the back end return data for create conversation

    /**
     * Create a conversation with the target user if one does not already exist.
     * The back end will return the conversation id for the two users.
     * 
     * The front end sends:
     * @param {int} userId1 One of the user ids to create a conversation with. 
     * @param {int} userId2 One of the user ids to create a conversation with. 
     */
    function openConversation(userId1, userId2) {
        fetch('/api/direct-messages/create-conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId1: userId1,
                userId2: userId2
            })
        })
            .then(res => res.json())
            .then(data => setConversationData(data))
            .catch(console.log());
    }

    /** Converts a role from an integer enum to a human-readable string. */
    function displayRole(role) {
        switch (role) {
            case 0: return "Unapproved User";
            case 1: return "Approved User";
            case 2: return "Moderator";
            case 3: return "Administrator";
            default: return "None";
        }
    }

    function displayRecentActivities() {
        return userData.recentActivities.map((activity, index) => {
            if (activity.type === 'T') {
                return <ActivityRow key={index} activity="thread" title={activity.title} id={activity.thread_id} />;
            }
            else if (activity.type === 'P') {
                return <ActivityRow key={index} activity="post in" title={activity.title} id={activity.thread_id} />;
            }
            else if (activity.type === 'L') {
                return <ActivityRow key={index} activity="listing" title={activity.title} id={activity.listing_id} />;
            } else {
                return "Invalid activity type in UserProfile.displayRecentActivities()!";
            }
        });
    }

    /* Gets the user's profile data using a GET request as soon as the page is loaded. */
    useEffect(() => {
        fetch(`/api/users/profile/${userId}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(console.log());
    }, [userId]);

    /* On successful conversation id fetch, navigate to the inbox page with the id in the state. On error, show an alert. */
    useEffect(() => {
        if (conversationData?.status === SUCCESS_STATUS) {
            navigate('/inbox', {
                state: {
                    initialSelectedConversationId: conversationData.conversationId
                }
            });
        } else if (conversationData?.status === ERROR_STATUS) {
            alert(conversationData.message);
        }
    }, [conversationData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!userData) return; // wait for fetch
    else if (userData.status === ERROR_STATUS) return <h1 className='page-title'>{userData.message}</h1>;
    else return (
        <div className='user-profile-page'>
            <Container className="profile-container" fluid>
                <Row>
                    <Col className='user-col' md="auto">
                        <img className='profile-pic' alt="user's pfp" height="300" width="300"
                            src={`/${userData.user.profile_picture_path}`}
                        />

                        <p className="name">{`${userData.user.first_name} ${userData.user.last_name}`}</p>
                        <p className="role">Role: {displayRole(userData.user.role)}</p>
                        <p className="join-date">Joined: {new Date(userData.user.join_date).toLocaleDateString()}</p>
                        <p className="user-id">User ID: {userId}</p>

                        {/* Show the Send Message button if this is not the user's own profile page. */}
                        {!isOwnProfilePage &&
                            <Button className='send-message-button default-button-color'
                                onClick={() => openConversation(userSession.user_id, userId)}
                            >
                                Send Message
                            </Button>
                        }
                    </Col>

                    {/* Show the edit profile picture icon if displaying the user's own profile page. */}
                    {isOwnProfilePage && <Col className='edit-picture-col' md='auto'>
                        <img className='edit-icon' src='/images/assets/editIcon.png' alt='edit pencil'
                            height='30' width='30' onClick={() => setChangePictureModalShow(true)}
                        />
                    </Col>}

                    <Col className="activity-table-col">
                        <div className="activity-table-div">
                            <h4 className='table-title'>{userData.user.first_name}'s Recent Activity</h4>
                            {displayRecentActivities()}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Displays/hides the change profile picture modal. */}
            <ChangePictureModal show={changePictureModalShow} onHide={() => setChangePictureModalShow(false)} userId={userId} />
        </div>
    );
}
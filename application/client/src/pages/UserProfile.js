/* This file handles the display of the User Profile page, which shows the details of a user and their recent activity.
 * Also, users can change their own profile pictures on this page, as well as start conversations with other users. */

import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import {
    ERROR_STATUS, FORUM_POST_ACTIVITY, FORUM_POST_ACTIVITY_TYPE, FORUM_THREAD_ACTIVITY,
    FORUM_THREAD_ACTIVITY_TYPE, LISTING_ACTIVITY, LISTING_ACTIVITY_TYPE, SUCCESS_STATUS
} from '../components/Constants.js';
import { getRoleDescription } from '../components/Dropdowns.js';
import ActivityRow from '../components/profile/ProfileActivityRow';
import ChangePictureModal from '../components/profile/ChangeProfilePicture.js';

export default function UserProfile() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { userId } = useParams(); // the userId in the URL
    userId = parseInt(userId); // converts userId from a string to an int

    const [changePictureModalShow, setChangePictureModalShow] = useState(false); // shows/hides the change profile picture modal
    const [userData, setUserData] = useState(null); // stores the user profile data sent from the back end
    const [conversationData, setConversationData] = useState(null); // holds the back end's data for starting a conversation

    /**
     * Create a conversation with the target user if one does not already exist.
     * The back end will return the conversation id for the two users.
     * 
     * Fetch Request's Body:
     * @param {int} userId1 One of the user ids in the conversation pair.
     * @param {int} userId2 The other user id in the conversation pair.
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

    /** Maps the user's recent activities to an ActivityRow component which handles the row's display and functionality. */
    function displayRecentActivities() {
        return userData.recentActivities.map((activity, index) => {
            if (activity.type === FORUM_THREAD_ACTIVITY_TYPE) {
                return (
                    <ActivityRow key={index} activity={FORUM_THREAD_ACTIVITY} title={activity.title} id={activity.thread_id} />
                );
            } else if (activity.type === FORUM_POST_ACTIVITY_TYPE) {
                return <ActivityRow key={index} activity={FORUM_POST_ACTIVITY} title={activity.title} id={activity.thread_id} />;
            } else if (activity.type === LISTING_ACTIVITY_TYPE) {
                return <ActivityRow key={index} activity={LISTING_ACTIVITY} title={activity.title} id={activity.listing_id} />;
            } else {
                return "Invalid activity type!";
            }
        });
    }

    /* 
     * Get the user's profile data as soon as the page is loaded.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user whose profile page we are getting.
     */
    useEffect(() => {
        fetch(`/api/users/profile/${userId}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(console.log());
    }, [userId]);

    /* On successful conversation id fetch, navigate to the inbox page with the conversation id in the state.
     * On error, show an alert. */
    useEffect(() => {
        if (conversationData?.status === SUCCESS_STATUS) {
            navigate('/inbox', {
                state: { initialSelectedConversationId: conversationData.conversationId }
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
                    {/* The left column which holds the user's picture and information. */}
                    <Col className='user-col' md="auto">
                        <img className='profile-pic' alt="user's pfp" height="300" width="300"
                            src={`/${userData.user.profile_picture_path}`}
                        />

                        <p className="name">{`${userData.user.first_name} ${userData.user.last_name}`}</p>
                        {/* Since the role is just an integer in the back end, we need to convert it
                          * to a string describing what that role is. */}
                        <p className="role">Role: {getRoleDescription(userData.user.role)}</p>
                        <p className="join-date">Joined: {new Date(userData.user.join_date).toLocaleDateString()}</p>
                        <p className="user-id">User ID: {userId}</p>

                        {/* Show the Send Message button if this is not the user's own profile page. */}
                        {userSession?.user_id !== userId &&
                            <Button className='send-message-button default-button-color'
                                onClick={() => openConversation(userSession.user_id, userId)}
                            >
                                Send Message
                            </Button>
                        }
                    </Col>

                    {/* Show the edit profile picture icon if this is the user's own profile page. */}
                    {userSession?.user_id === userId && <Col className='edit-picture-col' md='auto'>
                        <img className='edit-icon' src='/images/assets/editIcon.png' alt='edit pencil'
                            height='30' width='30' onClick={() => setChangePictureModalShow(true)}
                        />
                    </Col>}

                    {/* The right column which holds the user's recent activities. */}
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
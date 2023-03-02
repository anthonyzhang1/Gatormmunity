/* This file handles the display of the Group Home page. Here, the user can see the name of their group,
 * the group's description, the announcements, and so on. Group admins have the option of deleting the group
 * on this page, too. */

import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';
import ChangeAnnouncementModal from '../components/groups/GroupChangeAnnouncement.js';
import InviteModal from '../components/groups/GroupInvite.js';

export default function GroupHome() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { groupId } = useParams(); // gets the groupId in the URL as a string
    groupId = parseInt(groupId); // casts groupId into an int

    // shows/hides the change announcement modal
    const [changeAnnouncementModalShow, setChangeAnnouncementModalShow] = useState(false);
    const [inviteModalShow, setInviteModalShow] = useState(false); // hides/shows the invite modal
    const [homeData, setHomeData] = useState(null); // stores the home page data
    const [postData, setPostData] = useState(null); // stores the data sent by the back end after leaving/deleting the group

    /* 
     * Get the group's home page data from the back end upon page load.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user viewing the group's home page.
     * groupId: {int} The id of the group whose home page is being displayed.
     */
    useEffect(() => {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/home/${userSession.user_id}/${groupId}`)
            .then(res => res.json())
            .then(data => setHomeData(data))
            .catch(console.log())
    }, [userSession, groupId]);

    /**
     * Attempt to leave the group. Group admins cannot leave their group.
     * 
     * Fetch Request's Body:
     * groupId: {int} The id of the group the user is leaving.
     * userId: {int} The id of the user leaving the group.
     */
    function leaveGroup() {
        fetch('/api/groups/leave-group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                userId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /**
     * Attempt to delete the group. Only group admins can delete groups.
     * 
     * Fetch Request's Body:
     * groupId: {int} The id of the group the user is deleting.
     * userId: {int} The id of the user deleting the group. The user should be the group's admin.
     */
    function deleteGroup() {
        fetch('/api/groups/delete-group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                userId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /** Asks the user if they want to actually leave the group. */
    function confirmLeaveGroup() {
        if (window.confirm("Are you sure you want to leave this group?\nPress OK to leave.")) leaveGroup();
    }

    /** Asks the user if they want to actually delete the group. */
    function confirmDeleteGroup() {
        if (window.confirm("Are you sure you want to delete this group?\nPress OK to delete.")) deleteGroup();
    }

    /* Redirects to the groups page after leaving or deleting the group, or shows an error in an alert. */
    useEffect(() => {
        if (postData?.status === SUCCESS_STATUS) navigate('/groups');
        else if (postData?.status === ERROR_STATUS) alert(postData.message);
    }, [postData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!homeData) return; // wait for fetch
    else if (homeData.status === ERROR_STATUS) return <h1 className='page-title'>{homeData.message}</h1>;
    else return (
        <div className='group-home-page'>
            <Container className="group-home-container" fluid>
                <Row>
                    {/* The left column with the group picture, admin name, members, and buttons. */}
                    <Col className='left-col' md="auto">
                        <img className='group-picture' src={`/${homeData.group.picture_path}`} height="300" width="300"
                            alt="group pfp" />

                        <p className="admin-label">Admin:</p>
                        {/* Clicking on the admin's name takes you to their profile page. */}
                        <p className="admin-name" onClick={() => navigate(`/user/${homeData.group.admin_id}`)}>
                            {homeData.group.admin_name}
                        </p>

                        {/* Clicking on the members icon takes you to the list of members in the group. */}
                        <div className='members' onClick={() => navigate(`/group-members/${groupId}`)}>
                            <img className="members-icon" src="/images/assets/membersIcon.png" alt="members"
                                height="30" width="40"
                            />
                            <p className="members-number">{homeData.group.num_members}</p>
                        </div>

                        <Button className='default-button-color' onClick={() => navigate(`/group-forums/${groupId}`)}>
                            Forums
                        </Button>

                        <Button className='default-button-color' onClick={() => navigate(`/group-members/${groupId}`)}>
                            Members
                        </Button>

                        <Button className='default-button-color' onClick={() => setInviteModalShow(true)}>Invite</Button>

                        {/* Show the leave group button to all members but the group's admin. */}
                        {userSession.user_id !== homeData.group.admin_id &&
                            <Button className='leave-group-button' variant="danger" onClick={() => confirmLeaveGroup()}>
                                Leave Group
                            </Button>
                        }

                        {/* Show the delete group button to only the group's admin. */}
                        {userSession.user_id === homeData.group.admin_id &&
                            <Button className='delete-group-button' variant="danger" onClick={() => confirmDeleteGroup()}>
                                Delete Group
                            </Button>
                        }
                    </Col>

                    {/* The column with the name of the group, its description, and its announcement. */}
                    <Col className="right-col">
                        <h3 className='group-name'>{homeData.group.name}</h3>
                        <p className='group-description'>{homeData.group.description}</p>

                        <h3 className='announcement-header'>
                            Announcement

                            {/* Show the change announcement icon if the user is the group's admin. */}
                            {userSession.user_id === homeData.group.admin_id &&
                                <img className='edit-icon' src='/images/assets/editIcon.png' alt='edit pencil'
                                    height='25' width='25' onClick={() => setChangeAnnouncementModalShow(true)}
                                />
                            }
                        </h3>

                        <p className='announcement-body'>{homeData.group.announcement}</p>
                    </Col>
                </Row>
            </Container>

            {/* Displays/hides the modals. */}
            <InviteModal show={inviteModalShow} onHide={() => setInviteModalShow(false)}
                groupId={groupId} senderId={userSession.user_id}
            />
            <ChangeAnnouncementModal show={changeAnnouncementModalShow} onHide={() => setChangeAnnouncementModalShow(false)}
                groupId={groupId} userId={userSession.user_id}
            />
        </div>
    );
}
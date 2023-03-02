import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import InviteModal from '../components/groups/GroupInvite.js';
import ChangeAnnouncementModal from '../components/groups/GroupChangeAnnouncement.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';

export default function GroupHome() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { groupId } = useParams(); // gets the groupId in the URL as a string
    groupId = parseInt(groupId);

    const [inviteModalShow, setInviteModalShow] = useState(false);
    const [changeAnnouncementModalShow, setChangeAnnouncementModalShow] = useState(false);
    const [homeData, setHomeData] = useState(null); // GET fetch results
    const [postData, setPostData] = useState(null); // for leaving and deleting the group, since they are mutually exclusive

    /* Get the group home page's data from the back end. */
    useEffect(() => {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/home/${userSession.user_id}/${groupId}`)
            .then(res => res.json())
            .then(data => setHomeData(data))
            .catch(console.log())
    }, [userSession, groupId]);

    /** Attempt to leave the group. */
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

    /** Attempt to delete the group. */
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
                    {/* The column with the group picture, admin name, members, and buttons. */}
                    <Col className='left-col' md="auto">
                        <img className='group-picture' src={`/${homeData.group.picture_path}`} height="300" width="300"
                            alt="group pfp" />

                        <p className="admin-label">Admin:</p>
                        <p className="admin-name" onClick={() => navigate(`/user/${homeData.group.admin_id}`)}>
                            {homeData.group.admin_name}
                        </p>

                        <div className='members' onClick={() => navigate(`/group-members/${groupId}`)}>
                            <img className="members-icon" src="/images/assets/membersIcon.png" alt="members"
                                height="30" width="40"
                            />
                            <p className="members-number">{homeData.group.num_members}</p>
                        </div>

                        <div className='top-buttons-div'>
                            <Button className='forums-button default-button-color'
                                onClick={() => navigate(`/group-forums/${groupId}`)}
                            >
                                Forums
                            </Button>

                            <Button className='invite-button default-button-color' onClick={() => setInviteModalShow(true)}>
                                Invite
                            </Button>
                        </div>

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
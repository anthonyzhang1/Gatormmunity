import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import { mockGroups, mockUsers } from '../components/M3MockData';
import InviteModal from '../components/groups/GroupInvite.js';
import ChangeAnnouncementModal from '../components/groups/GroupChangeAnnouncement.js';

export default function GroupHome() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    const [inviteModalShow, setInviteModalShow] = useState(false);
    const [changeAnnouncementModalShow, setChangeAnnouncementModalShow] = useState(false);

    /** The number of admins in a group, i.e. 1. */
    const NUM_GROUP_ADMINS = 1;
    let { groupId } = useParams(); // gets the groupId in the URL as a string
    groupId = parseInt(groupId);

    const group = mockGroups.find(group => group.group_id === groupId); // can be undefined
    const numGroupMembers = group?.member_ids.length + group?.moderator_ids.length + NUM_GROUP_ADMINS;

    /* TODO: should fetch backend data for given userId in M4 */

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else if (!group) {
        return <h1 className='page-title'>This group does not exist.</h1>
    } else return (
        <div className='group-home-page'>
            <Container className="group-container" fluid>
                <Row>
                    {/* The column with the group picture, admin name, members, and buttons. */}
                    <Col className='left-col' md="auto">
                        <img className='group-picture' src={group.picture_path} alt="group pfp" height="300" width="300" />

                        <p className="admin-label">Admin:</p>
                        <p className="admin-name" onClick={() => { navigate(`/user/${group.admin_id}`) }}>
                            {/* Finds the user given their id and gets their full name */}
                            {mockUsers.find(user => user.user_id === group.admin_id).full_name}
                        </p>

                        <div className='members' onClick={() => navigate(`/group-members/${groupId}`)}>
                            <img className="members-icon" src="/images/assets/membersIcon.png" alt="members"
                                height="30" width="40"
                            />
                            <p className="members-number">{numGroupMembers}</p>
                        </div>

                        <div className='buttons-div'>
                            <Button className='forums-button default-button-color'
                                onClick={() => navigate(`/group-forums/${groupId}`)}
                            >
                                Forums
                            </Button>

                            <Button className='invite-button default-button-color' onClick={() => setInviteModalShow(true)}>
                                Invite
                            </Button>
                        </div>
                    </Col>

                    {/* The column with the name of the group, its description, and its announcement. */}
                    <Col className="right-col">
                        <h3 className='group-name'>{group.name}</h3>
                        <p className='group-description'>{group.description}</p>

                        <h3 className='announcement-header'>
                            Announcement
                            <img className='edit-icon' src='/images/assets/editIcon.png' alt='edit pencil'
                                height='25' width='25' onClick={() => setChangeAnnouncementModalShow(true)}
                            />
                        </h3>

                        <p className='announcement-body'>{group.announcement}</p>
                    </Col>
                </Row>
            </Container>

            {/* Displays/hides the modals. */}
            <InviteModal show={inviteModalShow} onHide={() => setInviteModalShow(false)} groupId={groupId} />
            <ChangeAnnouncementModal show={changeAnnouncementModalShow} onHide={() => setChangeAnnouncementModalShow(false)}
                groupId={groupId}
            />
        </div>
    );
}
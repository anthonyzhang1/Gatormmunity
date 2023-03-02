import { useContext } from 'react';
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { UserContext } from '../App.js';
import GroupMemberComponent from "../components/groups/GroupMember";
import { mockGroups, mockUsers } from "../components/M3MockData";

export default function GroupMemberPage() {
    const userSession = useContext(UserContext); // the user's session data
    let { groupId } = useParams(); // groupId in the URL
    groupId = parseInt(groupId); // converts groupId from a string to an int

    const group = mockGroups.find((group) => group.group_id === groupId)
    /** Stores the user data of the users in this group. */
    let groupUsers = [];

    /* Get the user data for all users of the group. */
    if (group) {
        // Get all the group user ids into the groupUsers array
        groupUsers.push(group.admin_id);
        groupUsers.push(group.member_ids);
        groupUsers.push(group.moderator_ids);

        // Converts the id arrays into just ids
        groupUsers = groupUsers.flat();

        // Get the user data given the user id from the groupUsers array
        groupUsers = groupUsers.map((member) => {
            return mockUsers.find((user) => user.user_id === member)
        });
    }

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else if (!group) {
        return <h1 className='page-title'>This group does not exist.</h1>
    } else return (
        <div className="group-members-page">
            <h3 className='page-title'>{group.name}'s Members</h3>

            <Row md="auto">
                {groupUsers.map((member) => {
                    let role = '';

                    if (member.user_id === group.admin_id) role = 'Admin';
                    else if (group.moderator_ids.find(moderatorId => moderatorId === member.user_id)) role = 'Moderator';
                    else role = 'Member';

                    return (
                        <Col md={6} key={member.user_id}>
                            <GroupMemberComponent name={member.full_name} picture={member.profile_picture_path} role={role}
                                user_id={member.user_id}
                            />
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}
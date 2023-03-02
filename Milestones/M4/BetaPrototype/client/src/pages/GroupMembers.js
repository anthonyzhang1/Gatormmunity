import { useContext, useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import { Navigate, useParams } from "react-router";
import { UserContext } from '../App.js';
import { ERROR_STATUS } from '../components/Constants.js';
import GroupMemberComponent from "../components/groups/GroupMember";

export default function GroupMemberPage() {
    const userSession = useContext(UserContext); // the user's session data
    let { groupId } = useParams(); // groupId in the URL
    groupId = parseInt(groupId); // converts groupId from a string to an int

    const [membersData, setMembersData] = useState(null); // response to GET request
    const [postData, setPostData] = useState(null); // response to POST request, passed to component

    /**
     * Gets the group members for the group we are trying to view.
     * 
     * The front end sends:
     * groupId: {int} The id of the group we are trying to get the members of.
     */
    function getMembers() {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/members/${userSession.user_id}/${groupId}`)
            .then(res => res.json())
            .then(data => setMembersData(data))
            .catch(console.log());
    }

    /* Get the members of the group as soon as the page loads. */
    useEffect(() => getMembers(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* If a POST request was undertaken, show the returned message and refresh the members list. */
    useEffect(() => {
        if (postData?.message) {
            alert(postData.message);
            getMembers();
        }
    }, [postData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!membersData) return; // wait for fetch
    else if (membersData.status === ERROR_STATUS) return <h1 className='page-title'>{membersData.message}</h1>;
    else return (
        <div className="group-members-page">
            <h3 className='page-title'>{membersData.groupName}'s Members</h3>

            <Row md="auto">
                {membersData.users.map((user) => {
                    return (<Col md={12} key={user.user_id}>
                        <GroupMemberComponent groupId={groupId} name={user.full_name} targetRole={user.group_role}
                            picture={user.profile_picture_thumbnail_path} targetUserId={user.user_id}
                            viewerGroupRole={membersData.groupRole} setPostData={setPostData}
                        />
                    </Col>);
                })}
            </Row>
        </div>
    );
}
/* This file handles the display of the Users Groups page, which shows all of the groups a user is in. */

import { useContext, useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router";
import { UserContext } from '../App.js';
import { ERROR_STATUS } from '../components/Constants.js';
import GroupRow from "../components/groups/UserGroup";

export default function UserGroups() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState(null); // stores the groups sent by the back end

    /*
     * Get the groups as soon as the page loads.
     *
     * Fetch Request's Parameters:
     * userId: {int} The id of the user whose groups we are getting.
     */
    useEffect(() => {
        if (!userSession?.isLoggedIn) return;

        fetch(`/api/groups/users-groups/${userSession.user_id}`)
            .then(res => res.json())
            .then(data => setGroupData(data))
            .catch(console.log())
    }, [userSession]);

    /** Maps all of the groups to a new GroupRow component. If there are no groups, show a message. */
    function displayGroups() {
        if (groupData.groups.length === 0) return <h2 className='no-groups-message'>You are not in any groups.</h2>;
        else return groupData.groups.map((group) => {
            return (
                <GroupRow key={group.group_id} group_id={group.group_id} name={group.name}
                    numGroupMembers={group.members_count} picture={group.picture_thumbnail_path}
                />
            );
        });
    }

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!groupData) return; // wait for fetch
    else if (groupData.status === ERROR_STATUS) return <h1 className='page-title'>{groupData.message}</h1>;
    else return (
        <div className="groups-page">
            <h2 className='page-title'>Your Groups</h2>

            <Button className="create-group-button default-button-color" onClick={() => navigate('/create-group')}>
                Create Group
            </Button>

            {/* Show the groups. */}
            {displayGroups()}
        </div>
    );
}
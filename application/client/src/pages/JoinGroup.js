/* This file handles the display of the Join Group page, which does not display anything other than a success 
 * or error message depending on whether the user joined the group or not. Users get to this page by entering the
 * invite link into their address bar. */

import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';

export default function JoinGroup() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { groupId, joinCode } = useParams(); // retrieved from the URL as strings
    groupId = parseInt(groupId); // cast the groupId into an int

    const [returnData, setReturnData] = useState(null); // stores the success/error status from the back end

    /* Attempt to join the group via the invite link as soon as the page is loaded.
     *
     * Fetch Request's Body:
     * groupId: {int} The id of the group the user is trying to join.
     * joinCode: {string} The join code required to join the group.
     * userId: {int} The id of the user trying to join the group.
     */
    useEffect(() => {
        if (!userSession?.isLoggedIn) return;

        fetch('/api/groups/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                joinCode: joinCode,
                userId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }, [groupId, joinCode, userSession]);

    /* On successful join, notify the user and redirect them to the joined group's home page. */
    useEffect(() => {
        if (returnData?.status === SUCCESS_STATUS) {
            alert("You have successfully joined the group!");
            navigate(`/group/${groupId}`);
        }
    }, [returnData, groupId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!returnData) return; // wait for fetch
    else if (returnData.status === ERROR_STATUS) return <h1 className='page-title'>{returnData.message}</h1>;
}
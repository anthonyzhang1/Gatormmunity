import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';

export default function JoinGroup() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { groupId, joinCode } = useParams(); // retrieved from the URL as strings
    groupId = parseInt(groupId);

    const [returnData, setReturnData] = useState(null);

    /* Attempt to join the group using a POST request as soon as the page is loaded. */
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
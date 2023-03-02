import { useContext, useState, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router";
import { UserContext } from '../App.js';
import { ERROR_STATUS } from '../components/Constants.js';
import GroupRow from "../components/groups/UserGroup";

export default function GroupPage() {
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();

	const [returnData, setReturnData] = useState(null);

	/* Get the groups as soon as the page loads. */
	useEffect(() => {
		if (!userSession?.isLoggedIn) return;

		fetch(`/api/groups/users-groups/${userSession.user_id}`)
			.then(res => res.json())
			.then(data => setReturnData(data))
			.catch(console.log())
	}, [userSession]);

	/** Maps all of the groups received from the back end to a new GroupRow component. */
	function displayGroups() {
		return returnData.groups.map((group) => {
			return (
				<GroupRow key={group.group_id} group_id={group.group_id} name={group.name}
					numGroupMembers={group.members_count} picture={group.picture_thumbnail_path}
				/>
			);
		});
	}

	if (!userSession) return; // wait for fetch
	else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
	else if (!returnData) return; // wait for fetch
	else if (returnData.status === ERROR_STATUS) return <h1 className='page-title'>{returnData.message}</h1>;
	else return (
		<div className="groups-page">
			<h2 className='page-title'>Your Groups</h2>
			<Button className="create-group-button default-button-color" onClick={() => navigate('/create-group')}>
				Create Group
			</Button>

			{/* Show a message if the useris not in any groups, otherwise show their groups. */}
			{returnData.groups.length === 0 && <h2 className='no-groups-message'>You are not in any groups.</h2>}
			{displayGroups()}
		</div>
	);
}
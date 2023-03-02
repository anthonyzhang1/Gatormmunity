import { useContext } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { UserContext } from '../App.js';
import GroupComponent from "../components/groups/UserGroup";
import { mockGroups } from "../components/M3MockData";

export default function GroupPage() {
	const NUM_GROUP_ADMINS = 1;
	const userSession = useContext(UserContext); // the user's session data
	const navigate = useNavigate();

	if (!userSession) {
		return <h1 className='page-title'>You must be logged in to see this page.</h1>
	} else return (
		<div className="groups-page">
			<h2 className='page-title'>Your Groups</h2>
			<Button className="create-group-button default-button-color" onClick={() => { navigate('/create-group') }}>
				Create Group
			</Button>

			{mockGroups.map((group) => {
				const numGroupMembers = group?.member_ids.length + group?.moderator_ids.length + NUM_GROUP_ADMINS;

				return (
					<GroupComponent key={group.group_id} name={group.name} picture={group.picture_thumbnail_path}
						numGroupMembers={numGroupMembers} group_id={group.group_id}
					/>
				);
			})}
		</div>
	);
}
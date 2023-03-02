/* This file holds the component which displays a singular group row in the Users Groups page.
 * Each row shows a group that the user is in. The row takes the user to the group's home page. */

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function GroupComponent(props) {
    const { name, picture, numGroupMembers, group_id } = props;
    const navigate = useNavigate();

    /** Takes the user to the group's forums page. */
    function goToForums(e) {
        e.stopPropagation();
        navigate(`/group-forums/${group_id}`);
    }

    return (
        // Takes the user to the group's page when clicking the component
        <div className="group-container" onClick={() => navigate(`/group/${group_id}`)}>
            {/* Elements in this div are on the left side of the component. */}
            <div className="left-side group-item">
                <img className="group-picture" src={`/${picture}`} width="50" height="50" alt={name} />
                <p className="group-name">{name}</p>
            </div>

            {/* Elements in this div are on the right side of the component. */}
            <div className="right-side group-item">
                <Button className="forums-button default-button-color" onClick={e => goToForums(e)}>Forums</Button>

                <img className="group-member-icon" src='/images/assets/membersIcon.png' alt='members icon'
                    width="40" height="30" 
                />
                <p className="group-member-number">{numGroupMembers}</p>
            </div>
        </div>
    );
}
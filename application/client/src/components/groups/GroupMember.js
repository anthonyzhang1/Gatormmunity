/* This file holds the component which displays a singular user row in the Group Members page.
 * If the user is a group mod or group admin, they will see options relating to member management,
 * e.g. a button to kick users. */

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { GROUP_ADMINISTRATOR_ROLE, GROUP_MEMBER_ROLE, GROUP_MODERATOR_ROLE, GROUP_ROLES } from "../Constants";

export default function GroupMemberComponent(props) {
    const { groupId, name, picture, targetRole, targetUserId, viewerGroupRole, setPostData } = props;
    const navigate = useNavigate();

    /** Converts the role integer into its string representation. */
    function getRoleString() {
        return GROUP_ROLES.find(role => role.value === targetRole).description;
    }

    /**
     * Try to kick a member from the group. Only group moderators or group administrators can do this.
     * The data returned from the back end is handled by the page, not this component.
     * 
     * Fetch Request's Body:
     * groupId: {int} The id of the group the member is being kicked from.
     * targetUserId: {int} The id of the user being kicked.
     * targetName: {string} The name of the user being kicked.
     */
    function kickMember() {
        fetch('/api/groups/kick-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                targetUserId: targetUserId,
                targetName: name
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /**
     * Try to promote a member of the group to a moderator. Only group administrators can do this.
     * The data returned from the back end is handled by the page, not this component.
     * 
     * Fetch Request's Body:
     * groupId: {int} The id of the group the member is being promoted in.
     * targetUserId: {int} The id of the user being promoted.
     * targetName: {string} The name of the user being promoted.
     */
    function promoteMember() {
        fetch('/api/groups/promote-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                targetUserId: targetUserId,
                targetName: name
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /**
     * Try to demote a moderator of the group to a regular group member. Only group administrators can do this.
     * The data returned from the back end is handled by the page, not this component.
     * 
     * Fetch Request's Body:
     * groupId: {int} The id of the group the member is being demoted in.
     * targetUserId: {int} The id of the user being demoted.
     * targetName: {string} The name of the user being demoted.
     */
    function demoteModerator() {
        fetch('/api/groups/demote-moderator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                targetUserId: targetUserId,
                targetName: name
            })
        })
            .then(res => res.json())
            .then(data => setPostData(data))
            .catch(console.log());
    }

    /** Asks the user if they want to actually kick the group member. */
    function confirmKickMember(e) {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to kick ${name}?\nPress OK to kick.`)) kickMember();
    }

    /** Asks the user if they want to actually promote the group member. */
    function confirmPromoteMember(e) {
        e.stopPropagation();

        if (window.confirm(`Are you sure you want to promote ${name} to a group moderator?\nPress OK to promote.`)) {
            promoteMember();
        }
    }

    /** Asks the user if they want to actually demote the group moderator. */
    function confirmDemoteModerator(e) {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to demote ${name} to a group member?\nPress OK to demote.`)) demoteModerator();
    }

    return (
        // Clicking on the component takes the user to the clicked on user's profile page
        <div className="group-member-comp" onClick={() => navigate(`/user/${targetUserId}`)}>
            {/* Elements in this div are left-aligned in the component. */}
            <div className="left-side">
                <img className="picture" src={`/${picture}`} width="50" height="50" alt={name} />
                <p className="name">{name}</p>
            </div>

            {/* Elements in this div are right-aligned in the component. */}
            <div className='right-side'>
                {/* Kick a group member out of the group as a group moderator. */}
                {(viewerGroupRole >= GROUP_MODERATOR_ROLE && targetRole === GROUP_MEMBER_ROLE) &&
                    <Button className='kick-button' variant='danger' onClick={e => confirmKickMember(e)}>Kick</Button>
                }

                {/* Promote a group member to a group moderator as a group administrator. */}
                {(viewerGroupRole === GROUP_ADMINISTRATOR_ROLE && targetRole === GROUP_MEMBER_ROLE) &&
                    <Button className="promote-button default-button-color" onClick={e => confirmPromoteMember(e)}>
                        Promote
                    </Button>
                }

                {/* Demote a group moderator to a group member as a group administrator. */}
                {(viewerGroupRole === GROUP_ADMINISTRATOR_ROLE && targetRole === GROUP_MODERATOR_ROLE) &&
                    <Button className="demote-button" variant="secondary" onClick={e => confirmDemoteModerator(e)}>
                        Demote
                    </Button>
                }

                <p className="role">({getRoleString()})</p>
            </div>
        </div>
    );
}
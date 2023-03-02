import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { GROUP_ROLES } from "../Constants";

export default function GroupMemberComponent(props) {
    const { groupId, name, picture, targetRole, targetUserId, viewerGroupRole, setPostData } = props;
    const navigate = useNavigate();

    /** Converts the role integer into its string representation. */
    function getRoleString() {
        return GROUP_ROLES.find(role => role.value === targetRole).description;
    }

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
        <div className="group-member-comp" onClick={() => navigate(`/user/${targetUserId}`)}>
            <div className="left-side">
                <img className="picture" src={`/${picture}`} width="50" height="50" alt={name} />
                <p className="name">{name}</p>
            </div>

            <div className='right-side'>
                {/* Kick a group member out of the group as a group moderator. */}
                {(viewerGroupRole >= 2 && targetRole === 1) &&
                    <Button className='kick-button' variant='danger' onClick={(e) => confirmKickMember(e)}>Kick</Button>
                }

                {/* Promote a group member to a group moderator as a group administrator. */}
                {(viewerGroupRole === 3 && targetRole === 1) &&
                    <Button className="promote-button default-button-color" onClick={(e) => confirmPromoteMember(e)}>
                        Promote
                    </Button>
                }

                {/* Demote a group moderator to a group member as a group administrator. */}
                {(viewerGroupRole === 3 && targetRole === 2) &&
                    <Button className="demote-button" variant="secondary" onClick={(e) => confirmDemoteModerator(e)}>
                        Demote
                    </Button>
                }

                <p className="role">({getRoleString()})</p>
            </div>
        </div>
    )
}
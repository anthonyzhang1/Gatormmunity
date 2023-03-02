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
        <div className="group-container" onClick={() => navigate(`/group/${group_id}`)}>
            <div className="group-item">
                <img className="group-picture" src={picture} width="50" height="50" alt={name} />
                <p className="group-name">{name}</p>
            </div>

            <div className="group-item">
                <Button className="forums-button default-button-color" onClick={(e) => goToForums(e)}>Forums</Button>

                <img className="group-member-icon" src='/images/assets/membersIcon.png'
                    width="40" height="30" alt='num members'
                />
                <p className="group-member-number">{numGroupMembers}</p>
            </div>
        </div>
    );
}
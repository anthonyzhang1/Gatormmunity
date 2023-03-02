import { useNavigate } from "react-router";

export default function GroupMemberComponent(props) {
    const { name, picture, role, user_id } = props;
    const navigate = useNavigate();

    return (
        <div className="group-member-container" onClick={() => navigate(`/user/${user_id}`)}>
            <img className="group-member-picture" src={picture} width="50" height="50" alt={name} />
            <p className="group-member-text" >[{role}] {name}</p>
        </div>
    )
}
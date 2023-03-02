import { useNavigate } from "react-router-dom";

export default function CurrentUser(props) {
    const { name, picture, userId } = props;
    const navigate = useNavigate();

    return (
        <div className="current-user-comp">
            <img className='picture' src={`/${picture}`} width="45" height="45" alt="correspondent's pfp"
                onClick={() => navigate(`/user/${userId}`)}
            />
            <p className="name" onClick={() => navigate(`/user/${userId}`)}>{name}</p>
            <div className='invisible-element-for-flexbox'></div>
        </div>
    );
}
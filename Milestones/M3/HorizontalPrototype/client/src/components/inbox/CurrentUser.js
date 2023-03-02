import { useNavigate } from "react-router-dom";

export default function CurrentUser(props) {
    const { name, picture, userId } = props;
    const navigate = useNavigate();

    return (
        <div className="inbox-current-user-component">
            <img className='current-user-pic' src={picture} width="45" height="45" alt='recipients profile pic'
                onClick={() => { navigate(`/user/${userId}`) }}
            />
            <p className="current-user-name" onClick={() => { navigate(`/user/${userId}`) }}>{name}</p>
        </div>
    );
}
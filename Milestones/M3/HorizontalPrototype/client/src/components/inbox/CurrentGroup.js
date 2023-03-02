import { useNavigate } from "react-router-dom";

export default function CurrentGroup(props) {
    const { name, picture, groupId } = props;
    const navigate = useNavigate();

    if (groupId >= 0) return ( // have the links be clickable if the group exists
        <div className='chat-current-group-component'>
            <img className='current-user-pic' src={picture} width="45" height="45" alt='group pic'
                onClick={() => { navigate(`/group/${groupId}`) }}
            />
            <p className="current-user-name" onClick={() => { navigate(`/group/${groupId}`) }}>{name}</p>
        </div>
    );
    else return ( // don't have the links be clickable if the group is gator chat
        <div className='chat-current-gator-chat-component'>
            <img className='current-user-pic' src={picture} width="45" height="45" alt='group pic' />
            <p className="current-user-name">{name}</p>
        </div>
    );
}
import { useNavigate } from "react-router-dom";

export default function CurrentGroup(props) {
    const { name, picture, groupId } = props;
    const navigate = useNavigate();

    if (groupId >= 1) {
        return ( // have the links be clickable if the group exists
            <div className='current-chat-comp'>
                <img className='picture is-group-chat' src={`/${picture}`} width="45" height="45" alt='group'
                    onClick={() => navigate(`/group/${groupId}`)}
                />
                <p className="name is-group-chat" onClick={() => navigate(`/group/${groupId}`)}>{name}</p>
                <div className='invisible-element-for-flexbox'></div>
            </div>
        );
    } else {
        return ( // don't have the links be clickable if the group is gator chat
            <div className='current-chat-comp'>
                <img className='picture' style={{ filter: 'grayscale(1) invert(1)' }} src={`/${picture}`}
                    width="45" height="45" alt='group'
                />
                <p className="name">{name}</p>
                <div className='invisible-element-for-flexbox'></div>
            </div>
        );
    }
}
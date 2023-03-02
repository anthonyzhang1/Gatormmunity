/* This file holds the component that shows the current group the user has selected,
 * and is reading the group chat messages of. The user can click on the group's image or name to go to the group's home page,
 * except with Gator Chat because Gator chat is not a group. */

import { useNavigate } from "react-router-dom";
import { GATOR_CHAT } from "../Constants";

export default function CurrentGroup(props) {
    const { name, picture, groupId } = props;
    const navigate = useNavigate();

    if (groupId === GATOR_CHAT.id) { // do not have the image and name be clickable if the chat is Gator Chat
        return (
            <div className='current-chat-comp'>
                {/* Invert the Gator Logo since the logo is white, and cannot be seen on the white background. */}
                <img className='picture' style={{ filter: 'grayscale(1) invert(1)' }} src={`/${picture}`}
                    width="45" height="45" alt='group'
                />
                <p className="name">{name}</p>
                <div className='invisible-element-for-flexbox'></div>
            </div>
        );
    } else { // have the image and name be clickable if we are viewing a Group Chat, i.e. not Gator Chat
        return (
            <div className='current-chat-comp'>
                <img className='picture is-group-chat' src={`/${picture}`} width="45" height="45" alt='group'
                    onClick={() => navigate(`/group/${groupId}`)}
                />
                <p className="name is-group-chat" onClick={() => navigate(`/group/${groupId}`)}>{name}</p>
                <div className='invisible-element-for-flexbox'></div>
            </div>
        );
    }
}
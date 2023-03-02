/* This file holds the component that shows one of the group chats of a group.
 * The group chats are displayed in the left column in the Chat page. */

import { Nav } from 'react-bootstrap';
import { GATOR_CHAT } from '../Constants';

export default function GroupChat(props) {
    const { groupId, groupName, groupPicture, onClick } = props;

    return (
        // What this component does on click depends on the prop passed to it
        <Nav.Item className='conversation-comp' onClick={onClick}>
            {/* This component is meant to be used in a Tab React Bootstrap component, hence eventKey. */}
            <Nav.Link className='conversation-tab' eventKey={groupId}>
                {/* Invert the Gator Logo since the logo is white, and cannot be seen on the white background. */}
                <img className='picture' src={`/${groupPicture}`} width="45" height="45" alt="group's pfp"
                    style={groupId === GATOR_CHAT.id ? { filter: 'grayscale(1) invert(1)' } : undefined}
                />
                <p className='name'>{groupName}</p>
            </Nav.Link>
        </Nav.Item>
    );
}
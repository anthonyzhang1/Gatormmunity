/* This file holds the component that shows one of the user's active conversations a user has with another user.
 * Conversations are a pair of users who are direct messaging each other, although not all conversations need to
 * have a direct message.
 * The conversations are displayed in the left column in the Inbox page. */

import { Nav } from 'react-bootstrap';

export default function Conversation(props) {
    const { conversationId, name, picture, onClick } = props;

    return (
        // What this component does on click depends on the prop passed to it
        <Nav.Item className='conversation-comp' onClick={onClick}>
            {/* This component is meant to be used in a Tab React Bootstrap component, hence eventKey. */}
            <Nav.Link className='conversation-tab' eventKey={conversationId}>
                <img className='picture' src={`/${picture}`} width="45" height="45" alt="user's pfp" />
                <p className='name'>{name}</p>
            </Nav.Link>
        </Nav.Item>
    );
}
import { Nav } from 'react-bootstrap';

export default function Conversation(props) {
    const { conversationId, name, picture, onClick } = props;

    return (
        <Nav.Item className='conversation-comp' onClick={onClick}>
            <Nav.Link className='conversation-tab' eventKey={conversationId}>
                <img className='picture' src={`/${picture}`} width="45" height="45" alt="user's pfp" />
                <p className='name'>{name}</p>
            </Nav.Link>
        </Nav.Item>
    );
}
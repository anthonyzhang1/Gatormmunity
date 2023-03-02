import { Nav } from 'react-bootstrap';

export default function GroupChat(props) {
    const { groupId, groupName, groupPicture, onClick } = props;

    return (
        <Nav.Item className='conversation-comp' onClick={onClick}>
            <Nav.Link className='conversation-tab' eventKey={groupId}>
                {/* Invert the gator logo in the conversation list to make it visible. */}
                <img className='picture' style={groupId === 0 ? { filter: 'grayscale(1) invert(1)' } : undefined}
                    src={`/${groupPicture}`} width="45" height="45" alt="group's pfp"
                />
                <p className='name'>{groupName}</p>
            </Nav.Link>
        </Nav.Item>
    );
}
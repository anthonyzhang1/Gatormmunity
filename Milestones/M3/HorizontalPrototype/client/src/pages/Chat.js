import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Nav, Tab } from 'react-bootstrap';
import { UserContext } from '../App.js';
import CurrentGroup from '../components/inbox/CurrentGroup.js';
import Message from '../components/inbox/Message';
import { mockGroups, mockUsers } from '../components/M3MockData.js';

/* Used for determining which side a message shows up on: left or right.
 * Will be replaced with user id's in M4 when we get to use back end data. */
const SELF_IS_SENDER = 1;
const OTHER_IS_SENDER = 2;

/** Some hardcoded data so that everyone can see the gator chat Chat. */
const gatorChat = {
    group_id: -1,
    name: "Gator Chat",
    picture_thumbnail_path: "/images/assets/gatorFrontLogoDark.png"
}

const mockMessagesData = [
    {
        type: SELF_IS_SENDER,
        content: "Hello, how is everyone doing today?",
        date: "11/4/2022, 04:53:10"
    }, {
        type: OTHER_IS_SENDER,
        content: "Could be better.",
        date: "11/4/2022, 04:53:55",
        sender_id: 101
    }, {
        type: OTHER_IS_SENDER,
        content: "Yes, likewise.",
        date: "11/4/2022, 04:54:22",
        sender_id: 102
    }, {
        type: OTHER_IS_SENDER,
        content: "Anyone up for some basketball?",
        date: "11/4/2022, 04:55:15",
        sender_id: 100
    }, {
        type: OTHER_IS_SENDER,
        content: "I am down!",
        date: "11/4/2022, 04:55:30",
        sender_id: 101
    }, {
        type: OTHER_IS_SENDER,
        content: "Let's gooooo",
        date: "11/4/2022, 04:55:40",
        sender_id: 102
    }, {
        type: SELF_IS_SENDER,
        content: "Count me in!",
        date: "11/4/2022, 04:56:25"
    }, {
        type: OTHER_IS_SENDER,
        content: "Sorry, not you.",
        date: "11/4/2022, 04:57:11",
        sender_id: 100
    }, {
        type: OTHER_IS_SENDER,
        content: "lol",
        date: "11/4/2022, 04:57:15",
        sender_id: 101
    }, {
        type: OTHER_IS_SENDER,
        content: "lol",
        date: "11/4/2022, 04:57:17",
        sender_id: 102
    }
];

export default function Chat() {
    const userSession = useContext(UserContext); // the user's session data

    const [currentGroupName, setCurrentGroupName] = useState(gatorChat.name);
    const [currentGroupPicture, setCurrentGroupPicture] = useState(gatorChat.picture_thumbnail_path);
    const [currentGroupId, setCurrentGroupId] = useState(gatorChat.group_id);

    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState(""); // stores the input from the message text entry field

    function changeCurrentGroup(name, picture, groupId) {
        setCurrentGroupName(name);
        setCurrentGroupPicture(picture);
        setCurrentGroupId(groupId);
    }

    /** Send a message and have it appear in the chat message window. It is just for demoing our application,
      * nothing is actually saved. */
    function sendMessage(e) {
        e.preventDefault();

        // save and add current message to a temporary messages array
        const saveMessages = messages;
        saveMessages.push({
            type: SELF_IS_SENDER,
            content: currentMessage,
            date: new Date().toLocaleString('en-US', { hourCycle: 'h23' })
        });

        setMessages(saveMessages); // update current messages list with the temporary message array
        setCurrentMessage(""); // clear the message box after sending
    }

    // Add Gator Chat to the beginning of the list of chats and then show the chats upon render
    useEffect(() => {
        if (mockGroups[0].group_id !== -1) mockGroups.unshift(gatorChat);
        setMessages(mockMessagesData);
    }, []);

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else return (
        <div className='inbox-page'>
            <div className='custom-row top-bar'>
                <Col sm={3} className="message-top-title">
                    <h3 className='messages-header'>Chats</h3>
                </Col>

                {/* Group's picture and name. */}
                <Col sm={9} className='current-user-col'>
                    <CurrentGroup name={currentGroupName} picture={currentGroupPicture} groupId={currentGroupId} />
                </Col>
            </div>

            <Tab.Container id="left-tabs-example" defaultActiveKey={currentGroupId}>
                <div className='custom-row bottom-row'>
                    <Col sm={3} className="users-tabs">
                        <Nav variant="pills" className="flex-column">
                            {mockGroups.map((group, index) => {
                                return (
                                    <Nav.Item key={index} className='conversation-item'
                                        onClick={() => changeCurrentGroup(group.name, group.picture_thumbnail_path,
                                            group.group_id)
                                        }
                                    >
                                        <Nav.Link eventKey={group.group_id}>
                                            <div className='conversation-tab'>
                                                <img className='contact-pic' src={group.picture_thumbnail_path}
                                                    width="45" height="45" alt="group's pfp"
                                                />
                                                <p className='contact-name'>{group.name}</p>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            })}
                        </Nav>
                    </Col>

                    <Col sm={9}>
                        <Tab.Content className='tab-content'>
                            {/* Create a tab-content for each conversation that we that, same number as tab */}
                            {mockGroups.map((group) => {
                                return (
                                    <Tab.Pane key={group.group_id} eventKey={group.group_id}>
                                        {messages.map((message, index) => {
                                            const type = message.type;
                                            // get the name of the user given their sender id
                                            const name = type === SELF_IS_SENDER ? userSession.first_name :
                                                mockUsers.find(user => user.user_id === message.sender_id).full_name;

                                            return (
                                                <Message key={index} type={type} name={name} content={message.content}
                                                    date={message.date}
                                                />
                                            );
                                        })}
                                    </Tab.Pane>
                                );
                            })}

                            <Form className='send-message-form' onSubmit={sendMessage}>
                                {/* Input Message Field */}
                                <Form.Group className='send-message-group' controlId='chat-send-message'>
                                    <Form.Control className='send-message-container' required as='textarea'
                                        rows={2} value={currentMessage} placeholder='Enter message...'
                                        onChange={e => setCurrentMessage(e.target.value)}
                                    />
                                </Form.Group>

                                <Button className="send-button default-button-color" type='submit'>
                                    <img className='send-icon' src="/images/assets/sendMessage.png" alt="send message icon"
                                        height="25" width="25"
                                    />
                                </Button>
                            </Form>
                        </Tab.Content>
                    </Col>
                </div>
            </Tab.Container>
        </div>
    );
}
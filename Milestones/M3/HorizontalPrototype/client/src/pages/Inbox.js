import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Nav, Tab } from 'react-bootstrap';
import { UserContext } from '../App.js';
import CurrentUser from '../components/inbox/CurrentUser.js';
import Message from '../components/inbox/Message';
import { mockUsers } from '../components/M3MockData.js';

/* Used for determining which side a message shows up on: left or right.
 * Will be replaced with user id's in M4 when we get to use back end data. */
const SELF_IS_SENDER = 1;
const OTHER_IS_SENDER = 2;

const mockMessagesData = [
    {
        type: SELF_IS_SENDER,
        content: "Hello, how are you?",
        date: "11/4/2022, 04:53:10"
    }, {
        type: OTHER_IS_SENDER,
        content: "I'm fine. How might I help you?",
        date: "11/4/2022, 04:53:55"
    }, {
        type: SELF_IS_SENDER,
        content: "I would like to know if we can meet at the CS Lab for the deal?",
        date: "11/4/2022, 04:55:10"
    }, {
        type: OTHER_IS_SENDER,
        content: "Yes, that would be ideal.",
        date: "11/4/2022, 04:55:55"
    }, {
        type: OTHER_IS_SENDER,
        content: "I will be there in 3 minutes.",
        date: "11/4/2022, 04:56:30"
    }
];

export default function Inbox() {
    const userSession = useContext(UserContext); // the user's session data

    const [currentUserName, setCurrentUserName] = useState(mockUsers[0].full_name);
    const [currentUserPicture, setCurrentUserPicture] = useState(mockUsers[0].profile_picture_thumbnail_path);
    const [currentUserId, setCurrentUserId] = useState(mockUsers[0].user_id);

    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState(""); // stores the input from the message text entry field

    function changeCurrentUser(name, picture, userId) {
        setCurrentUserName(name);
        setCurrentUserPicture(picture);
        setCurrentUserId(userId);
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

    // Show the messages upon page render
    useEffect(() => {
        setMessages(mockMessagesData);
    }, []);

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else return (
        <div className='inbox-page'>
            <div className='custom-row top-bar'>
                <Col sm={3} className="message-top-title">
                    <h3 className='messages-header'>Messages</h3>
                </Col>

                {/* Recipient's profile picture and name. */}
                <Col sm='auto' className='current-user-col'>
                    <CurrentUser name={currentUserName} picture={currentUserPicture} userId={currentUserId} />
                </Col>
            </div>

            <Tab.Container id="left-tabs-example" defaultActiveKey={currentUserId}>
                <div className='custom-row bottom-row'>
                    <Col sm={3} className="users-tabs">
                        <Nav variant="pills" className="flex-column">
                            {mockUsers.map((user, index) => {
                                return (
                                    <Nav.Item key={index} className='conversation-item'
                                        onClick={() => changeCurrentUser(user.full_name, user.profile_picture_thumbnail_path,
                                            user.user_id)
                                        }
                                    >
                                        <Nav.Link eventKey={user.user_id}>
                                            <div className='conversation-tab'>
                                                <img className='contact-pic' src={user.profile_picture_thumbnail_path}
                                                    width="45" height="45" alt="user's pfp"
                                                />
                                                <p className='contact-name'>{user.full_name}</p>
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
                            {mockUsers.map((user) => {
                                return (
                                    <Tab.Pane key={user.user_id} eventKey={user.user_id}>
                                        {messages.map((message, index) => {
                                            const type = message.type;
                                            // get the name of the sender
                                            const name = type === SELF_IS_SENDER ? userSession.first_name : user.full_name;

                                            return (
                                                <Message key={index} type={type} name={name}
                                                    content={message.content} date={message.date}
                                                />
                                            );
                                        })}
                                    </Tab.Pane>
                                );
                            })}

                            <Form className='send-message-form' onSubmit={sendMessage}>
                                {/* Input Message Field */}
                                <Form.Group className='send-message-group' controlId='inbox-send-message'>
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
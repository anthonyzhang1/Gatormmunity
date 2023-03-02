/* This file handles the display of the Chat page, which has both Gator Chat and Group Chats for the groups the user is in.
 * Users can send and receive chat messages in real time. The page takes user input for sending a message. */

import { useContext, useEffect, useState } from 'react';
import { Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import {
    ENTER_KEY, ERROR_STATUS, GATOR_CHAT, MESSAGE_LEFT_ALIGNMENT, MESSAGE_RIGHT_ALIGNMENT,
    REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS, SUCCESS_STATUS
} from '../components/Constants.js';
import CurrentGroup from '../components/messaging/CurrentGroup.js';
import GroupChat from '../components/messaging/GroupChat.js';
import Message from '../components/messaging/Message';

export default function Chat() {
    const userSession = useContext(UserContext); // the user's session data

    // Gator Chat is selected by default
    const [selectedChat, setSelectedChat] = useState({
        groupId: GATOR_CHAT.id,
        groupName: GATOR_CHAT.name,
        groupPicture: GATOR_CHAT.picture
    });

    const [chatsData, setChatsData] = useState(null); // the chats in the left column
    const [messagesData, setMessagesData] = useState(null); // the messages in the right column
    const [messageInput, setMessageInput] = useState(""); // stores the input from the message text entry field
    const [sendData, setSendData] = useState(null); // the returned data for the message sent

    /**
     * Gets the group chats for the groups the user is in.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user to get the group chats for.
     */
    function getGroupChats() {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/get-chats/${userSession.user_id}`)
            .then(res => res.json())
            .then(data => setChatsData(data))
            .catch(console.log());
    }

    /**
     * Gets the Gator/group chat messages from the selected group.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user trying to see the messages.
     * groupId: {int} The id of the group we are trying to see chat messages from. Can be 0,
     *     which means get Gator Chat's messages.
     */
    function getMessages() {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/get-messages/${userSession.user_id}/${selectedChat.groupId}`)
            .then(res => res.json())
            .then(data => setMessagesData(data))
            .catch(console.log());
    }

    /**
     * Sends the sent chat message to the back end for it to insert into the database.
     * 
     * Fetch Request's Body:
     * body: {string} The body of the message. Required; it must be 1-5'000 characters long.
     * groupId: {int} The id of the group the message is being sent to. Can be 0, which means it is a Gator Chat message.
     * senderId: {int} The id of the user sending the message.
     */
    function sendChatMessage() {
        fetch('/api/groups/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: messageInput,
                groupId: selectedChat.groupId,
                senderId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setSendData(data))
            .catch(console.log());
    }

    /** Sets the selectedChat state. */
    function handleSetSelectedChat(groupId, groupName, groupPicture) {
        setSelectedChat({
            groupId: groupId,
            groupName: groupName,
            groupPicture: groupPicture
        });
    }

    /** Maps the chat groups to the left column. */
    function displayChats() {
        return chatsData.groupChats.map((chat) => {
            return (
                <GroupChat key={chat.group_id} groupId={chat.group_id} groupName={chat.name}
                    groupPicture={chat.picture_thumbnail_path}
                    onClick={() => handleSetSelectedChat(chat.group_id, chat.name, chat.picture_thumbnail_path)}
                />
            );
        });
    }

    /** Maps the messages to the message log. */
    function displayMessages() {
        return messagesData.messages.map((message) => {
            return (
                // Align the message on the right if the user is the sender, otherwise align on the left
                <Message key={message.chat_message_id} name={message.sender_name} content={message.body}
                    alignment={userSession.user_id === message.sender_id ? MESSAGE_RIGHT_ALIGNMENT : MESSAGE_LEFT_ALIGNMENT}
                    date={message.creation_date}
                />
            );
        });
    }

    /** Sends the entered message if Enter is pressed, but just inserts a new line when Shift + Enter is pressed.
      * The text field is cleared upon message send. */
    function handleKeyPress(e) {
        // If Enter is pressed without Shift, do not add a new line, just send the message and clear the text field.
        // Conversely, if Shift+Enter is pressed, add a new line per the default behaviour of textareas.
        if (e.key === ENTER_KEY && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
            setMessageInput("");
        }
    }

    /* Get the group chats upon page load. */
    useEffect(() => getGroupChats(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Get the messages. Update the messages whenever we change group chats, and update it periodically using a timer. */
    useEffect(() => {
        getMessages();

        // get the messages on a timer
        const interval = setInterval(() => getMessages(), REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS);
        return () => clearInterval(interval); // kill the timer after we change chats
    }, [userSession, selectedChat]); // eslint-disable-line react-hooks/exhaustive-deps

    /* On successful message send, refresh the messages shown. On error, alert the user. */
    useEffect(() => {
        if (sendData?.status === SUCCESS_STATUS) getMessages();
        else if (sendData?.status === ERROR_STATUS) alert(sendData.message)
    }, [sendData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!chatsData || !messagesData) return; // wait for fetch
    else if (chatsData.status === ERROR_STATUS) return <h1 className='page-title'>{chatsData.message}</h1>;
    else if (messagesData.status === ERROR_STATUS) return <h1 className='page-title'>{messagesData.message}</h1>;
    else return (
        <div className='chat-inbox-page'>
            <Tab.Container className='chat-tab-container' id="left-tabs" defaultActiveKey={selectedChat.groupId}>
                {/* Top Row */}
                <Row className='top-row'>
                    {/* Top Left Quadrant */}
                    <Col className="top-left-col" sm={3}>
                        <h3>Group Chats</h3>
                    </Col>

                    {/* Top Right Quadrant */}
                    <Col className='top-right-col'>
                        {/* The group whose messages are currently being displayed. */}
                        <CurrentGroup groupId={selectedChat.groupId} name={selectedChat.groupName}
                            picture={selectedChat.groupPicture}
                        />
                    </Col>
                </Row>

                {/* Bottom Row */}
                <Row className='bottom-row'>
                    {/* Bottom Left Quadrant */}
                    <Col className="bottom-left-col" sm={3}>
                        <Nav className="flex-column" variant="pills">
                            {/* Gator Chat chat will always be at the top of the group chats list. */}
                            <GroupChat key={GATOR_CHAT.id} groupId={GATOR_CHAT.id} groupName={GATOR_CHAT.name}
                                groupPicture={GATOR_CHAT.picture}
                                onClick={() => handleSetSelectedChat(GATOR_CHAT.id, GATOR_CHAT.name, GATOR_CHAT.picture)}
                            />

                            {/* Display the rest of the chats. */}
                            {displayChats()}
                        </Nav>
                    </Col>

                    {/* Bottom Right Quadrant */}
                    <Col className="bottom-right-col">
                        <Tab.Content className='tab-content'>
                            <Tab.Pane className='tab-pane' eventKey={selectedChat.groupId}>
                                {displayMessages()}

                                {/* Send Message Field */}
                                <Form className='send-message-form' onKeyDown={handleKeyPress}>
                                    <Form.Group className='send-message-group' controlId='chat-send-message'>
                                        <Form.Control className='send-message-container' required as='textarea' rows={2}
                                            placeholder={
                                                "Enter your message.\n" +
                                                "Press Enter to send, or Shift+Enter for a new line."
                                            }
                                            value={messageInput} onChange={e => setMessageInput(e.target.value)}
                                        />
                                    </Form.Group>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
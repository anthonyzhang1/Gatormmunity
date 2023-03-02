/* This file handles the display of the Chat page, which has both Gator Chat and Group Chats for the groups the user is in.
 * The page takes user input for sending a message, which is sent to the back end for validation. */

import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, GATOR_CHAT, SUCCESS_STATUS } from '../components/Constants.js';
import CurrentGroup from '../components/inbox/CurrentGroup.js';
import GroupChat from '../components/inbox/GroupChat.js';
import Message from '../components/inbox/Message';

export default function Chat() {
    /** How many milliseconds to wait to update the chat message log. 1000 ms = 1 sec */
    const REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS = 1000;
    const userSession = useContext(UserContext); // the user's session data

    // Gator Chat is selected by default
    const [selectedChat, setSelectedChat] = useState({
        groupId: GATOR_CHAT.id,
        groupName: GATOR_CHAT.name,
        groupPicture: GATOR_CHAT.picture
    });

    const [chatsData, setChatsData] = useState(null); // the chats in the left column
    const [messagesData, setMessagesData] = useState(null); // the messages in the right column
    const [sendData, setSendData] = useState(null); // the returned data for the message sent
    const [messageInput, setMessageInput] = useState(""); // stores the input from the message text entry field

    /**
     * Gets the group chats for the groups the user is in.
     * 
     * The front end sends:
     * userId: {int} The id of the user to get the group chats for.
     */
    function getGroupChats() {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/get-chats/${userSession.user_id}`)
            .then(res => res.json())
            .then(data => setChatsData(data))
            .catch(console.log())
    }

    /**
     * Gets the Gator/group chat messages from the selected group.
     * 
     * The front end sends:
     * userId: {int} The id of the user trying to see the messages.
     * groupId: {int} The id of the group we are trying to see chat messages from. Can be 0, which means get Gator Chat messages.
     */
    function getMessages() {
        if (!userSession?.user_id) return;

        fetch(`/api/groups/get-messages/${userSession.user_id}/${selectedChat.groupId}`)
            .then(res => res.json())
            .then(data => setMessagesData(data))
            .catch(console.log())
    }

    /**
     * Sends the sent chat message to the back end for it to insert into the database.
     * 
     * The front end sends:
     * body: {string} The body of the message. Required; it must be 1-5'000 characters long.
     * groupId: {int} The id of the group the message is being sent to. Can be 0, which means it is a Gator Chat message.
     * senderId: {int} The id of the user sending the message.
     */
    function sendChatMessage(e) {
        e.preventDefault();

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
        setSelectedChat({ groupId: groupId, groupName: groupName, groupPicture: groupPicture });
    }

    /** Maps the chat groups to the bottom left column. */
    function displayChats() {
        return chatsData.groups.map(group => {
            return (
                <GroupChat key={group.group_id} groupId={group.group_id} groupName={group.name}
                    groupPicture={group.picture_thumbnail_path}
                    onClick={() => handleSetSelectedChat(group.group_id, group.name, group.picture_thumbnail_path)}
                />
            );
        })
    }

    /** Maps the messages to the bottom right column. */
    function displayMessages() {
        return messagesData.messages.map((message) => {
            return (
                <Message key={message.chat_message_id} alignment={userSession.user_id === message.sender_id ? "R" : "L"}
                    name={message.sender_name} content={message.body} date={message.creation_date}
                />
            )
        })
    }

    /* Get the group chats upon page load. */
    useEffect(() => getGroupChats(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Get the messages. Update the messages whenever we change selected group chats,
     * and update it periodically based on a timer. */
    useEffect(() => {
        getMessages();
        const interval = setInterval(() => getMessages(), REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS);
        return () => clearInterval(interval); // kill the timer after we change chats
    }, [userSession, selectedChat]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Refresh the messages shown and clear the form on successful message send. On error, alert the user. */
    useEffect(() => {
        if (sendData?.status === SUCCESS_STATUS) {
            getMessages();
            setMessageInput("");
        } else if (sendData?.status === ERROR_STATUS) {
            alert(sendData.message);
        }
    }, [sendData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!chatsData || !messagesData) return; // wait for fetch
    else if (chatsData.status === ERROR_STATUS) return <h1 className='page-title'>{chatsData.message}</h1>;
    else if (messagesData.status === ERROR_STATUS) return <h1 className='page-title'>{messagesData.message}</h1>;
    else return (
        <div className='chat-inbox-page'>
            <Tab.Container className='chat-tab-container' id="left-tabs" defaultActiveKey={selectedChat.groupId}>
                <Row className='top-row'> {/* Top Row */}
                    {/* Top Left Quadrant */}
                    <Col className="top-left-col" sm={3}>
                        <h3>Group Chats</h3>
                    </Col>

                    {/* Top Right Quadrant */}
                    <Col className='top-right-col'>
                        <CurrentGroup groupId={selectedChat.groupId} name={selectedChat.groupName}
                            picture={selectedChat.groupPicture}
                        />
                    </Col>
                </Row>

                <Row className='bottom-row'> {/* Bottom Row */}
                    {/* Bottom Left Quadrant */}
                    <Col className="bottom-left-col" sm={3}>
                        <Nav className="flex-column" variant="pills">
                            {/* The hardcoded Gator Chat chat */}
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
                                <Form className='send-message-form' onSubmit={sendChatMessage}>
                                    <Form.Group className='send-message-group' controlId='chat-send-message'>
                                        <Form.Control className='send-message-container' required as='textarea'
                                            rows={2} value={messageInput} placeholder='Enter message...'
                                            onChange={e => setMessageInput(e.target.value)}
                                        />
                                    </Form.Group>

                                    {/* Send Button with the send icon inside of it */}
                                    <Button className="send-button default-button-color" type='submit'>
                                        <img className='send-icon' src="/images/assets/sendMessage.png" alt="send icon"
                                            height="25" width="25"
                                        />
                                    </Button>
                                </Form>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
}
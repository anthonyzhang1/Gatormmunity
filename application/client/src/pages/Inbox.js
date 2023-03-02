/* This file handles the display of the Inbox page, which show the conversations the user has with other users,
 * and the direct messages within those conversations. Users can send and receive messages in real time.
 * The page takes user input for sending messages. */

import { useContext, useEffect, useState } from 'react';
import { Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App.js';
import {
    ENTER_KEY, ERROR_STATUS, MESSAGE_LEFT_ALIGNMENT, MESSAGE_RIGHT_ALIGNMENT,
    REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS, SUCCESS_STATUS
} from '../components/Constants.js';
import Conversation from '../components/messaging/Conversation.js';
import CurrentUser from '../components/messaging/CurrentUser.js';
import Message from '../components/messaging/Message';

export default function Inbox() {
    const userSession = useContext(UserContext); // the user's session data
    const { state } = useLocation();
    /* The initial conversation to show. This is initialized with a conversation ID provided by useLocation's state,
     * if it exists. useLocation's state only exists if navigating to the Inbox page via "Send Message" or "Contact Seller",
     * for example. */
    let { initialSelectedConversationId } = state || {};

    const [selectedConversation, setSelectedConversation] = useState(null); // stores the currently selected conversation's data
    const [conversationsData, setConversationsData] = useState(null); // the conversations in the left column
    const [messagesData, setMessagesData] = useState(null); // the messages in the right column
    const [messageInput, setMessageInput] = useState(""); // stores the input from the message text entry field
    const [sendData, setSendData] = useState(null); // the returned data for the message sent

    /* If there was no initial selected conversation ID provided by useLocation, and there are conversations in the list,
     * then set the initial selected conversation to be the first conversation in the list,
     * i.e. the one with the most recent messages. */
    if (!initialSelectedConversationId && conversationsData?.conversations?.length) {
        initialSelectedConversationId = conversationsData.conversations[0].conversation_id;
    }

    /**
     * Gets the conversations the user has.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user to get the conversations for.
     */
    function getConversations() {
        if (!userSession?.user_id) return;

        fetch(`/api/direct-messages/get-conversations/${userSession.user_id}`)
            .then(res => res.json())
            .then(data => setConversationsData(data))
            .catch(console.log())
    }

    /**
     * Gets the direct messages from the selected conversation.
     * 
     * Fetch Request's Parameters:
     * conversationId: {int} The id of the conversation we are trying to see the messages for.
     */
    function getDirectMessages() {
        if (!userSession?.user_id || !selectedConversation) return; // make sure a conversation is selected first

        fetch(`/api/direct-messages/get-messages/${selectedConversation.conversationId}`)
            .then(res => res.json())
            .then(data => setMessagesData(data))
            .catch(console.log())
    }

    /**
     * Sends a direct message to the back end for it to insert into the database.
     * 
     * Fetch Request's Body:
     * body: {string} The body of the message. Required; it must be 1-5'000 characters long.
     * conversationId: {int} The id of the conversation the message is being sent to.
     * senderId: {int} The id of the user sending the message.
     */
    function sendDirectMessage() {
        fetch('/api/direct-messages/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                body: messageInput,
                conversationId: selectedConversation.conversationId,
                senderId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setSendData(data))
            .catch(console.log());
    }

    /** Sets the selectedConversation state. */
    function handleSetSelectedConversation(conversationId, partnerUserId, partnerName, partnerPicture) {
        setSelectedConversation({
            conversationId: conversationId,
            userId: partnerUserId,
            name: partnerName,
            picture: partnerPicture
        });
    }

    /** Maps the conversations to the left column. If the user has no conversations, show a message. */
    function displayConversations() {
        if (conversationsData.conversations.length === 0) return <h4 className='mt-3'>You have no messages.</h4>;
        else return conversationsData.conversations.map((conversation) => {
            return (
                <Conversation key={conversation.conversation_id} conversationId={conversation.conversation_id}
                    name={conversation.name} picture={conversation.profile_picture_thumbnail_path}
                    onClick={() => handleSetSelectedConversation(conversation.conversation_id, conversation.user_id,
                        conversation.name, conversation.profile_picture_thumbnail_path)
                    }
                />
            );
        });
    }

    /** Maps the messages to the direct message log. If the user is the sender, the message is aligned on the right.
      * Otherwise, it is aligned on the left. */
    function displayMessages() {
        return messagesData?.messages.map((message) => {
            return (
                <Message key={message.direct_message_id} name={message.sender_name} content={message.body}
                    date={message.creation_date}
                    alignment={userSession.user_id === message.sender_id ? MESSAGE_RIGHT_ALIGNMENT : MESSAGE_LEFT_ALIGNMENT}
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
            sendDirectMessage();
            setMessageInput("");
        }
    }

    /* Get the conversations upon page load. */
    useEffect(() => getConversations(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* This initializes the `selectedConversation` state with the initially selected conversation (provided by
     * useLocation's state or the first conversation in the conversation list). */
    useEffect(() => {
        if (initialSelectedConversationId && conversationsData?.conversations) {
            /** Contains the data needed to initialize the selected conversation. */
            const initialSelectedConversation = conversationsData.conversations.find(element =>
                element.conversation_id === initialSelectedConversationId
            );

            // Sets the data retrieved from the initial selected conversation to the `selectedConversation` state
            handleSetSelectedConversation(initialSelectedConversation.conversation_id, initialSelectedConversation.user_id,
                initialSelectedConversation.name, initialSelectedConversation.profile_picture_thumbnail_path);
        }
    }, [initialSelectedConversationId, conversationsData]);

    /* Get the messages. Update the messages whenever we change conversations, and update it periodically using a timer. */
    useEffect(() => {
        getDirectMessages();

        // get the messages on a timer
        const interval = setInterval(() => getDirectMessages(), REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS);
        return () => clearInterval(interval); // kill the timer after we change conversations
    }, [selectedConversation]); // eslint-disable-line react-hooks/exhaustive-deps

    /* On successful message send, refresh the messages shown. On error, alert the user. */
    useEffect(() => {
        if (sendData?.status === SUCCESS_STATUS) getDirectMessages();
        else if (sendData?.status === ERROR_STATUS) alert(sendData.message);
    }, [sendData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!conversationsData) return; // wait for fetch
    else if (conversationsData.status === ERROR_STATUS) return <h1 className='page-title'>{conversationsData.message}</h1>;
    else if (messagesData?.status === ERROR_STATUS) return <h1 className='page-title'>{messagesData.message}</h1>;
    else return (
        <div className='chat-inbox-page'>
            <Tab.Container className='chat-tab-container' id="left-tabs" defaultActiveKey={initialSelectedConversationId}>
                {/* Top Row */}
                <Row className='top-row'>
                    {/* Top Left Quadrant */}
                    <Col className="top-left-col" sm={3}>
                        <h3>Messages</h3>
                    </Col>

                    {/* Top Right Quadrant */}
                    <Col className='top-right-col'>
                        {/* The user we are currently conversing with. */}
                        {selectedConversation &&
                            <CurrentUser userId={selectedConversation.userId} name={selectedConversation.name}
                                picture={selectedConversation.picture}
                            />
                        }
                    </Col>
                </Row>

                {/* Bottom Row */}
                <Row className='bottom-row'>
                    {/* Bottom Left Quadrant */}
                    <Col className="bottom-left-col" sm={3}>
                        <Nav className="flex-column" variant="pills">
                            {/* Display the conversations. */}
                            {displayConversations()}
                        </Nav>
                    </Col>

                    {/* Bottom Right Quadrant */}
                    <Col className="bottom-right-col">
                        <Tab.Content className='tab-content'>
                            <Tab.Pane className='tab-pane' eventKey={selectedConversation?.conversationId}>
                                {displayMessages()}

                                {/* Send Message Field */}
                                <Form className='send-message-form' onKeyDown={handleKeyPress}>
                                    <Form.Group className='send-message-group' controlId='inbox-send-message'>
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
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App.js';
import { ERROR_STATUS, SUCCESS_STATUS } from '../components/Constants.js';
import Conversation from '../components/inbox/Conversation.js';
import CurrentUser from '../components/inbox/CurrentUser.js';
import Message from '../components/inbox/Message';

export default function Inbox() {
    /** How many milliseconds to wait to update the chat message log. 1000 ms = 1 sec */
    const REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS = 1000;
    const userSession = useContext(UserContext); // the user's session data
    const { state } = useLocation();
    const { initialSelectedConversationId } = state || {}; // the conversation to show by default, if this value was provided

    const [selectedConversation, setSelectedConversation] = useState(null); // No direct messages are selected by default
    const [conversationsData, setConversationsData] = useState(null); // the conversations in the left column
    const [messagesData, setMessagesData] = useState(null); // the messages in the right column
    const [sendData, setSendData] = useState(null); // the returned data for the message sent
    const [messageInput, setMessageInput] = useState(""); // stores the input from the message text entry field

    /**
     * Gets the conversations the user has.
     * 
     * The front end sends:
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
     * The front end sends:
     * conversationId: {int} The id of the conversation we are trying to see the messages for.
     */
    function getDirectMessages() {
        if (!userSession?.user_id || !selectedConversation) return;

        fetch(`/api/direct-messages/get-messages/${selectedConversation.conversationId}`)
            .then(res => res.json())
            .then(data => setMessagesData(data))
            .catch(console.log())
    }

    /**
     * Sends a direct message to the back end for it to insert into the database.
     * 
     * The front end sends:
     * body: {string} The body of the message. Required; it must be 1-5'000 characters long.
     * conversationId: {int} The id of the conversation the message is being sent to.
     * senderId: {int} The id of the user sending the message.
     */
    function sendDirectMessage(e) {
        e.preventDefault();

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

    /** Maps the conversations to the bottom left column. If the user has no conversations, show a message. */
    function displayConversations() {
        if (conversationsData.conversations.length === 0) return <h4 className='mt-3'>You have no messages.</h4>;

        return conversationsData.conversations.map(conversation => {
            return (
                <Conversation key={conversation.conversation_id} conversationId={conversation.conversation_id}
                    name={conversation.name} picture={conversation.profile_picture_thumbnail_path}
                    onClick={() => handleSetSelectedConversation(conversation.conversation_id, conversation.user_id,
                        conversation.name, conversation.profile_picture_thumbnail_path)
                    }
                />
            );
        })
    }

    /** Maps the messages to the bottom right column. */
    function displayMessages() {
        return messagesData?.messages.map((message) => {
            return (
                <Message key={message.direct_message_id} alignment={userSession.user_id === message.sender_id ? "R" : "L"}
                    name={message.sender_name} content={message.body} date={message.creation_date}
                />
            )
        });
    }

    /* Get the conversations upon page load. */
    useEffect(() => getConversations(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* If the user tried to create a new conversation from a different page, open that conversation by default. */
    useEffect(() => {
        if (initialSelectedConversationId && conversationsData?.status === SUCCESS_STATUS) {
            /** Contains the data needed to initialize the selected conversation. */
            const selectedConversationData = conversationsData.conversations.find(element =>
                element.conversation_id === initialSelectedConversationId
            );

            // Sets thed data retrieved from the selected conversation to the selected conversation state
            handleSetSelectedConversation(selectedConversationData.conversation_id, selectedConversationData.user_id,
                selectedConversationData.name, selectedConversationData.profile_picture_thumbnail_path);
        }
    }, [initialSelectedConversationId, conversationsData]);

    /* Get the messages. Update the messages whenever we change conversations, and update it periodically based on a timer. */
    useEffect(() => {
        getDirectMessages();
        const interval = setInterval(() => getDirectMessages(), REFRESH_MESSAGES_INTERVAL_IN_MILLISECONDS);
        return () => clearInterval(interval); // kill the timer after we change conversations
    }, [selectedConversation]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Refresh the messages shown and clear the form on successful message send. On error, alert the user. */
    useEffect(() => {
        if (sendData?.status === SUCCESS_STATUS) {
            getDirectMessages();
            setMessageInput("");
        } else if (sendData?.status === ERROR_STATUS) {
            alert(sendData.message);
        }
    }, [sendData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!conversationsData) return; // wait for fetch
    else if (conversationsData.status === ERROR_STATUS) return <h1 className='page-title'>{conversationsData.message}</h1>;
    else if (messagesData?.status === ERROR_STATUS) return <h1 className='page-title'>{messagesData.message}</h1>;
    else return (
        <div className='chat-inbox-page'>
            <Tab.Container className='chat-tab-container' id="left-tabs" defaultActiveKey={initialSelectedConversationId}>
                <Row className='top-row'> {/* Top Row */}
                    {/* Top Left Quadrant */}
                    <Col className="top-left-col" sm={3}>
                        <h3>Messages</h3>
                    </Col>

                    {/* Top Right Quadrant */}
                    <Col className='top-right-col'>
                        {selectedConversation &&
                            <CurrentUser userId={selectedConversation.userId} name={selectedConversation.name}
                                picture={selectedConversation.picture}
                            />
                        }
                    </Col>
                </Row>

                <Row className='bottom-row'> {/* Bottom Row */}
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
                                <Form className='send-message-form' onSubmit={sendDirectMessage}>
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
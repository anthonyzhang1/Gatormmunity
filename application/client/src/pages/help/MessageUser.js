/* This file holds the code for the Message User help page, which explains how one can message another user. */

import { messageUser } from '../../components/help/Questions';

export default function MessageUser() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{messageUser.question}</h1>
            <p className="answer">
                To start a conversation with another user, go to the user's profile page and click on "Send Message".
                This will open a conversation between you and them, and then you will be redirected to the Inbox page
                where you can send and receive messages with each other. <br /><br />

                You may also start a conversation with another user by clicking on a listing and clicking on "Message Seller".
            </p>
        </div>
    );
}
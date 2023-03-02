import { messageUser } from '../../components/help/Questions';

export default function MessageUser() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{messageUser.question}</h1>
            <p className="answer">
                To start a chat with another user, go to the user's profile page and click on "Send Message".
                This will open a chat between you and the other user, and then you will be redirected to the Inbox page
                where you can send and receive messages with each other.
            </p>
        </div>
    );
}
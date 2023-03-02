/* This file holds the component that shows a chat message or direct message.
 * The message is aligned on the left if someone else sent the message, otherwise it is aligned on the right. */

import { MESSAGE_LEFT_ALIGNMENT } from "../Constants";

export default function Message(props) {
    const { name, date, content, alignment } = props;

    return (
        <div className='chat-inbox-message-comp'>
            <div className={alignment === MESSAGE_LEFT_ALIGNMENT ? 'message-header-left' : 'message-header-right'}>
                {/* Only show the name of the message sender if someone else sent the message. */}
                {alignment === MESSAGE_LEFT_ALIGNMENT && <p className="author">{name}</p>}

                {/* The message's timestamp. */}
                <p className="date">{new Date(date).toLocaleString('en-US', { hourCycle: 'h23' })}</p>
            </div>

            <div className={alignment === MESSAGE_LEFT_ALIGNMENT ? 'message-container-left' : 'message-container-right'}>
                <p className="content">{content}</p>
            </div>
        </div>
    );
}
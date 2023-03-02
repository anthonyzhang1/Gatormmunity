export default function Message(props) {
    const SELF_IS_SENDER = 1;
    const OTHER_IS_SENDER = 2;

    // type: SELF_IS_SENDER if the current user is the sender, OTHER_IS_SENDER if someone else sent the message
    const { name, date, content, type } = props;

    return (
        <div className='inbox-message-component'>
            <div className={type === SELF_IS_SENDER ? 'message-date-end' : 'message-date'}>
                <p className="message-author">{type === OTHER_IS_SENDER ? name : ""}</p>
                <p>{date}</p>
            </div>
            
            <div className={type === OTHER_IS_SENDER ? 'message-container-end' : 'message-container'}>
                <p className="message-content">{content}</p>
            </div>
        </div>
    );
}
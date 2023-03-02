export default function Message(props) {
    const { name, date, content, alignment } = props;

    return (
        <div className='chat-inbox-message-comp'>
            <div className={alignment === 'L' ? 'message-header-left' : 'message-header-right'}>
                {alignment === 'L' && <p className="author">{name}</p>}
                <p className="date">{new Date(date).toLocaleString('en-US', { hourCycle: 'h23' })}</p>
            </div>

            <div className={alignment === 'L' ? 'message-container-left' : 'message-container-right'}>
                <p className="content">{content}</p>
            </div>
        </div>
    );
}
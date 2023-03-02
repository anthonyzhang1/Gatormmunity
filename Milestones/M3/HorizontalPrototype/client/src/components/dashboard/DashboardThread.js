import { useNavigate } from 'react-router-dom';

export default function LastThread(props) {
    const { threadId, title } = props;
    const navigate = useNavigate();

    return (
        <div className='dashboard-thread-component' onClick={() => { navigate(`/thread/${threadId}`) }}>
            <p className='title'>{title}</p>
        </div>
    )
}
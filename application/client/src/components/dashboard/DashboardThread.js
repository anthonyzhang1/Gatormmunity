/* This file holds the component which displays the recent Gatormmunity forum threads on the Dashboard page.
 * Clicking on a thread row takes the user to that thread's page. */

import { useNavigate } from 'react-router-dom';

export default function DashboardThread(props) {
    const { threadId, title } = props;
    const navigate = useNavigate();

    return (
        <div className='dashboard-thread-component' onClick={() => navigate(`/thread/${threadId}`)}>
            <p className='title'>{title}</p>
        </div>
    );
}
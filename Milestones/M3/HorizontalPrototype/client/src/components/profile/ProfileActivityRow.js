import { useNavigate } from 'react-router-dom';

export default function ActivityRow(props) {
    let { activity, title, link } = props;
    const navigate = useNavigate();

    // rename activity for "post" to better describe what the title shows
    if (activity === "post") activity = "post in";

    return (
        <div className='profile-activity-component' onClick={() => navigate(link)}>
            <p className="activity-text">Created {activity}: {title}</p>
        </div>
    );
}
import { useNavigate } from 'react-router-dom';

export default function ActivityRow(props) {
    let { activity, title, id } = props;
    const navigate = useNavigate();

    function goToActivity() {
        if (activity === "thread" || activity === "post in") return navigate(`/thread/${id}`);
        else if (activity === "listing") return navigate(`/listing/${id}`);
        else alert("Invalid activity in ProfileActivityRow.goToActivity()!");
    }

    return (
        <div className='profile-activity-component' onClick={goToActivity}>
            <p className="activity-text">Created {activity}: {title}</p>
        </div>
    );
}
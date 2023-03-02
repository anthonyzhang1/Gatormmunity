/* This file holds the component which displays an activity performed by some user on their Profile page.
 * Clicking on an activity row takes the user to that activity's page, e.g. the listing's page if the activity was a listing. */

import { useNavigate } from 'react-router-dom';
import { FORUM_POST_ACTIVITY, FORUM_THREAD_ACTIVITY, LISTING_ACTIVITY } from '../Constants';

export default function ActivityRow(props) {
    let { activity, title, id } = props;
    const navigate = useNavigate();

    /** Navigates the user to either the thread's page or the listing' page, depending on the activity. */
    function goToActivity() {
        if (activity === FORUM_THREAD_ACTIVITY || activity === FORUM_POST_ACTIVITY) return navigate(`/thread/${id}`);
        else if (activity === LISTING_ACTIVITY) return navigate(`/listing/${id}`);
        else alert("Invalid activity in the user's recent activities!");
    }

    return (
        <div className='profile-activity-component' onClick={goToActivity}>
            {/* Only creation of threads, listings, etc. is logged in the activity rows. Hence, "created". */}
            <p className="activity-text">Created {activity}: {title}</p>
        </div>
    );
}
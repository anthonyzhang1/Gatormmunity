/* This file holds the component which displays the recent marketplace listing rows on the Dashboard page.
 * Clicking on a listing row takes the user to that listing's page. */

import { useNavigate } from 'react-router-dom';

export default function DashboardListing(props) {
    const { listingId, name, price } = props;
    const navigate = useNavigate();

    return (
        <div className='dashboard-listing-component' onClick={() => navigate(`/listing/${listingId}`)}>
            <p className='name'>{name}</p>
            <p className='price'>${price}</p>
        </div>
    );
}
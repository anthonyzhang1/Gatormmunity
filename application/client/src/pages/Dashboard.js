/* This file handles the display of the Dashboard page. All users will see this page after logging in.
 * The page serves to greet the user and show them what is currently happening on Gatormmunity by showing them recent
 * Gatormmunity Forum threads and marketplace listings. */

import { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import ListingRow from '../components/dashboard/DashboardListing.js';
import ForumThreadRow from '../components/dashboard/DashboardThread.js';

export default function Dashboard() {
    const userSession = useContext(UserContext); // the user's session data
    const [returnData, setReturnData] = useState(null); // stores the data sent by the back end

    /** 
     * Gets the dashboard table rows with the recent threads and listings from the back end.
     * Gets the user's profile picture too.
     * 
     * Fetch Request's Parameters:
     * userId: {int} The id of the user viewing their dashboard.
     */
    function getDashboardData() {
        if (!userSession?.user_id) return;

        fetch(`/api/users/dashboard/${userSession.user_id}`)
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /* Get the dashboard table rows and the user's profile picture when the page has loaded. */
    useEffect(() => getDashboardData(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!returnData) return; // wait for fetch
    else return (
        <div className="dashboard-page">
            {/* Contains the greeting picture and message. */}
            <div className="welcome-div">
                <img src={`/${returnData.profile_picture_path}`} alt="user's pfp" height="100" width="100" />
                <h1>Welcome, {userSession.first_name}!</h1>
            </div>

            <h4 className="slogan-body-text">See what's happening on Gatormmunity...</h4>

            <Container className='lists-container'>
                <div className='list'>
                    <h4 className='list-title'>Recent Gatormmunity Forum Threads</h4>

                    {/* Show the most recent Gatormmunity forum threads. */}
                    {returnData.threads.map((thread) => {
                        return <ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} title={thread.title} />;
                    })}
                </div>

                <div className='list'>
                    <h4 className='list-title'>Recent Marketplace Listings</h4>

                    {/* Show the most recent marketplace listings. */}
                    {returnData.listings.map((listing) => {
                        return (
                            <ListingRow key={listing.listing_id} listingId={listing.listing_id}
                                name={listing.title} price={listing.price}
                            />
                        );
                    })}
                </div>
            </Container>
        </div>
    );
}
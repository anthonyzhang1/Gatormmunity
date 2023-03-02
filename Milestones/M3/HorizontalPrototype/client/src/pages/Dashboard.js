import { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../App.js';
import ListingRow from '../components/dashboard/DashboardListing.js';
import ForumThreadRow from '../components/dashboard/DashboardThread.js';
import { mockListings, mockThreads } from '../components/M3MockData.js';

export default function Dashboard() {
    const userSession = useContext(UserContext); // the user's session data

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else return (
        <div className="dashboard-page">
            <div className="welcome-div">
                <img src={userSession.profile_picture_path} alt="user's pfp" height="100" width="100" />
                <h1>Welcome, {userSession.first_name}!</h1>
            </div>

            <p className="slogan-body-text">
                See what's happening on Gatormmunity...
            </p>

            <Container className='lists-container'>
                <div className='list'>
                    <h4 className='list-title'>Recent Gatormmunity Forum Threads</h4>

                    {/* Show the 6 most recent Gatormmunity forum threads. */}
                    {mockThreads.slice(-6).reverse()
                        .filter((thread) => thread.group_id === null)
                        .map((thread) => {
                            return <ForumThreadRow key={thread.thread_id} threadId={thread.thread_id} title={thread.title} />
                        })
                    }
                </div>

                <div className='list'>
                    <h4 className='list-title'>Recent Marketplace Listings</h4>

                    {/* Gets the 6 most recent marketplace listings and display them on the dashboard. */}
                    {mockListings.slice(-6).reverse().map((listing) => {
                        return (
                            <ListingRow key={listing.listing_id} listingId={listing.listing_id}
                                name={listing.name} price={listing.price}
                            />
                        );
                    })}
                </div>
            </Container>
        </div>
    );
}
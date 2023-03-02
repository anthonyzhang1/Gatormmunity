/* This file handles the display of the View Listing page, which shows the details of a marketplace listing,
 * e.g. picture, price, category, seller.
 * If the user is the one who made the listing, then they can delete the listing. Moderators can delete any listing. */

import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import { ERROR_STATUS, MODERATOR_ROLE, SUCCESS_STATUS } from '../components/Constants.js';
import HelpfulLinksList from '../components/help/HelpfulLinksList.js';
import { howToCreateListing, meetingBuyerSeller, report } from '../components/help/Questions';

export default function ViewListing() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { listingId } = useParams(); // the listingId in the URL
    listingId = parseInt(listingId); // converts listingId from a string to an int

    const [listingData, setListingData] = useState(null); // stores the listing's data from the back end
    const [deleteData, setDeleteData] = useState(null); // state the back end's response to deleting the listing
    const [conversationData, setConversationData] = useState(null); // holds the back end's data for starting a conversation

    /** The questions that will be shown in the helpful links list. */
    const questions = [howToCreateListing, meetingBuyerSeller, report];

    /**
     * Gets the listing's data.
     * 
     * Fetch Request's Parameters:
     * listingId: {int} The id of the listing to get the data of.
     */
    function getListingData() {
        fetch(`/api/listings/view/${listingId}`)
            .then(res => res.json())
            .then(data => setListingData(data))
            .catch(console.log());
    }

    /**
     * Sends the request to the back end to delete the listing.
     * 
     * Fetch Request's Body:
     * listingId: {int} The id of the listing to delete.
     * userId: {int} The id of the user doing the deleting.
     */
    function deleteListing() {
        fetch('/api/listings/delete-listing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                listingId: listingId,
                userId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setDeleteData(data))
            .catch(console.log());
    }

    /**
     * Create a conversation with the seller if one does not already exist.
     * The back end will return the conversation id for the two users.
     * 
     * Fetch Request's Body:
     * @param {int} userId1 One of the user ids in the conversation pair.
     * @param {int} userId2 The other user id in the conversation pair.
     */
    function openConversation(userId1, userId2) {
        fetch('/api/direct-messages/create-conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId1: userId1,
                userId2: userId2
            })
        })
            .then(res => res.json())
            .then(data => setConversationData(data))
            .catch(console.log());
    }

    /** Asks the user if they want to actually delete their listing. */
    function confirmDeleteListing() {
        if (window.confirm("Are you sure you want to delete this listing?\nPress OK to delete.")) deleteListing();
    }

    /* Display the listing's data after rendering the page. */
    useEffect(() => getListingData(), []); // eslint-disable-line react-hooks/exhaustive-deps

    /* Tells the user if their listing was successfully deleted and navigates them to the marketplace page.
     * On error, display an error message. */
    useEffect(() => {
        if (deleteData?.status === SUCCESS_STATUS) {
            alert("The listing has been deleted.");
            navigate('/marketplace');
        } else if (deleteData?.status === ERROR_STATUS) {
            alert(deleteData.message);
        }
    }, [deleteData]); // eslint-disable-line react-hooks/exhaustive-deps

    /* On successful conversation id fetch, navigate to the inbox page with the conversation id in the state.
     * On error, show an alert. */
    useEffect(() => {
        if (conversationData?.status === SUCCESS_STATUS) {
            navigate('/inbox', {
                state: { initialSelectedConversationId: conversationData.conversationId }
            });
        } else if (conversationData?.status === ERROR_STATUS) {
            alert(conversationData.message);
        }
    }, [conversationData]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!listingData) return; // wait for fetch
    else if (listingData.status === ERROR_STATUS) return <h1 className="page-title">{listingData.message}</h1>;
    else return (
        <div className="view-listing-page">
            <Container className="listing-container" fluid>
                <Row>
                    {/* The left column with the helpful links list in it. */}
                    <Col className="helpful-links-col" md="auto">
                        <HelpfulLinksList questions={questions} />
                    </Col>

                    {/* The right column with the listing in it. */}
                    <Col className="listing-col" md="auto">
                        <div className='listing-div'>
                            <h4 className='listing-header'>{listingData.listing.title}</h4>
                            <img className='listing-image' src={`/${listingData.listing.image_path}`} alt='listing'
                                width="300" height='300' onClick={() => window.open(`/${listingData.listing.image_path}`)}
                            />

                            <p className='description'>{listingData.listing.description}</p>
                            <p className='price'>${listingData.listing.price}</p>
                            <p className='category'>Category: {listingData.listing.category}</p>

                            {/* Show the seller's email as an alternate contact method besides direct messaging. */}
                            <span className='seller-label'>Seller:</span>
                            <span className='seller' onClick={() => navigate(`/user/${listingData.listing.seller_id}`)}>
                                &nbsp;{listingData.listing.seller_name} ({listingData.listing.email})
                            </span>

                            <div className='buttons-div'>
                                {/* Go back to the previous page. */}
                                <Button className="back-button" variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>

                                {/* Show the delete option for the seller and moderators. */}
                                {(userSession.user_id === listingData.listing.seller_id || userSession.role >= MODERATOR_ROLE) &&
                                    <Button className='delete-button' variant='danger' onClick={() => confirmDeleteListing()}>
                                        Delete Listing
                                    </Button>
                                }

                                {/* Show the message seller button if the user is viewing another user's listing. */}
                                {userSession.user_id !== listingData.listing.seller_id &&
                                    <Button className="message-seller-button default-button-color"
                                        onClick={() => openConversation(userSession.user_id, listingData.listing.seller_id)}
                                    >
                                        Message Seller
                                    </Button>
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
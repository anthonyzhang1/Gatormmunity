import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { UserContext } from '../App.js';
import { mockListings, mockUsers } from '../components/M3MockData.js';
import HelpfulLinksList from '../components/help/HelpfulLinksList.js';
import * as questions from '../components/help/Questions';

export default function ViewListing() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();
    let { listingId } = useParams(); // listingId in the URL
    listingId = parseInt(listingId); // converts listingId from a string to an int

    const listing = mockListings.find(listing => listing.listing_id === listingId); // can be undefined
    const author = mockUsers.find(user => user.user_id === listing?.author_id);

    /** The links that will be shown in the helpful links list. */
    const links = [
        questions.meetingBuyerSeller,
        questions.reportUser
    ];

    /* TODO: should fetch backend data for given listingId in M4 */

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } else if (!listing) {
        return <h1 className="page-title">This listing does not exist.</h1>
    } else return (
        <div className="view-listing-page">
            <Container className="listing-container" fluid>
                <Row>
                    {/* The left column with the helpful links list in it */}
                    <Col className="helpful-links-col" md="auto">
                        <HelpfulLinksList questions={links} />
                    </Col>

                    {/* The right column with the listing in it */}
                    <Col className="listing-col" md="auto">
                        <div className='listing-div'>
                            <h4 className='listing-header'>{listing.name}</h4>
                            <img className='listing-image' src={listing.picture} alt='listing' width="300" height='300' />

                            <p className='description'>{listing.description}</p>
                            <p className='price'>${listing.price}</p>
                            <p className='category'>Category: {listing.category}</p>

                            <span className='seller-label'>Seller:</span>
                            <span className='seller' onClick={() => navigate(`/user/${author.user_id}`)}>
                                &nbsp;{author.full_name} ({author.email})
                            </span>

                            <div className='buttons-div'>
                                {/* Go back to the previous page. */}
                                <Button className="back-button" variant="secondary" onClick={() => { navigate(-1) }}>
                                    Go Back
                                </Button>

                                <Button className="message-seller-button default-button-color"
                                    onClick={() => navigate('/inbox')}
                                >
                                    Message Seller
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
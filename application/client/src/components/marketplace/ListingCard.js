/* This file holds the component that shows a listing's card on the Marketplace and Search page.
 * Clicking on the card takes the user to the clicked on listing's View Listing page. */

import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function ListingCard(props) {
    const { listing_id, name, price, picture } = props;
    const navigate = useNavigate();

    return (
        <Card className='listing-card' onClick={() => navigate(`/listing/${listing_id}`)}>
            <Card.Img className="listing-image" src={`/${picture}`} />
            <Card.Body>
                <Card.Title className='listing-name'>{name}</Card.Title>
                <Card.Text>${price}</Card.Text>
            </Card.Body>
        </Card>
    );
}
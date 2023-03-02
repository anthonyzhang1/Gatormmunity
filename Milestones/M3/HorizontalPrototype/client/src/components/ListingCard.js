import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

export default function ListingCard(props) {
    const { listing_id, name, price, picture } = props;
    const navigate = useNavigate();

    return (
        // Clicking anywhere on the card will take you to the listing's page
        <Card className='listing-card' onClick={() => { navigate(`/listing/${listing_id}`) }}>
            <Card.Img className="listing-image" src={picture} />
            <Card.Body>
                <Card.Title className='listing-name'>{name}</Card.Title>
                <Card.Text>${price}</Card.Text>
            </Card.Body>
        </Card>
    );
}
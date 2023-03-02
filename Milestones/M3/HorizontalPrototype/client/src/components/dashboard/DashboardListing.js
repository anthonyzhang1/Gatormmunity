import { useNavigate } from 'react-router-dom';

export default function ItemMarketPlace(props) {
    const { listingId, name, price } = props;
    const navigate = useNavigate();

    return (
        <div className='dashboard-listing-component' onClick={() => { navigate(`/listing/${listingId}`); }}>
            <p className='name'>{name}</p>
            <p className='price'>${price}</p>
        </div>
    )
}
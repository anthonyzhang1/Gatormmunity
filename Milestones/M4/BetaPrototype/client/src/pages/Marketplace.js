import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { UserContext } from '../App.js';
import { Navigate, useNavigate } from 'react-router-dom';
import { ANY_CATEGORY, ERROR_STATUS } from "../components/Constants.js";
import Listing from "../components/ListingCard";
import { getListingCategoryFilterOptions } from "../components/search/SearchDropdowns";

export default function Marketplace() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    const [categoryFilter, setCategoryFilter] = useState(ANY_CATEGORY); // by default, no filter is applied
    const [maxPriceFilter, setMaxPriceFilter] = useState("");
    const [listingData, setListingData] = useState(null); // the listings and their titles, descriptions, etc.

    /** 
     * Get the listings from the back end.
     * @param {event} e Can be null.
     * 
     * The front end sends:
     * category: {string} The listing category to filter by. Can be null, which means display listings in all categories.
     * maxPrice: {string} The maximum price to filter by. Can be null, which means display listings of any price.
     */
    function getListings(e) {
        e?.preventDefault(); // stops the page from refreshing after applying the filters

        fetch('/api/listings/get-listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: categoryFilter === ANY_CATEGORY ? null : categoryFilter,
                maxPrice: maxPriceFilter === '' ? null : maxPriceFilter
            })
        })
            .then(res => res.json())
            .then(data => setListingData(data))
            .catch(console.log());
    }

    function displayListingMessage() {
        if (listingData.listings?.length === 0) return <h2>No listings matched the provided filters.</h2>;
        else if (listingData.status === 'info') return <h2>{listingData.message}</h2>;
    }

    /** Maps all of the listings received from the back end to a new Listing component. */
    function displayListings() {
        return listingData.listings?.map((listing) => {
            return (
                <Col className="d-flex align-items-stretch" key={listing.listing_id}>
                    <Listing listing_id={listing.listing_id} name={listing.title} price={listing.price}
                        picture={listing.image_thumbnail_path}
                    />
                </Col>
            );
        });
    }

    /* Get the listings as soon as the page loads. */
    useEffect(() => getListings(), []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (!listingData) return; // wait for fetch
    else if (listingData.status === ERROR_STATUS) return <h1 className='page-title'>{listingData.message}</h1>;
    else return (
        <div className="marketplace-page">
            <Container className="marketplace-container" fluid>
                <Row>
                    <Col className="filters-col" md="auto">
                        <h2 className="filters-header">Filters</h2>

                        <Form className="filters-form" onSubmit={getListings}>
                            {/* Category Dropdown Filter */}
                            <Form.Group className="category-filter mb-3" controlId="marketplace-category">
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={e => setCategoryFilter(e.target.value)}>
                                    {/* Lists all the valid categories into the dropdown */}
                                    {getListingCategoryFilterOptions()}
                                </Form.Select>
                            </Form.Group>

                            {/* Max Price Filter */}
                            <Form.Group className="mb-3" controlId="marketplace-max-price">
                                <Form.Label>Max Price (USD)</Form.Label>
                                <Form.Control className="max-price" type='number' step="0.01" placeholder='None'
                                    onChange={e => setMaxPriceFilter(e.target.value)}
                                />
                            </Form.Group>

                            {/* Apply the filters when pressing the apply button */}
                            <Button className="apply-button default-button-color" type="submit">Apply</Button>
                        </Form>
                    </Col>

                    <Col className="listings-col">
                        <h2 className="listings-header">Listings</h2>

                        <Button className="create-button default-button-color" onClick={() => navigate("/create-listing")}>
                            Create Listing
                        </Button>

                        {/* Display the listing info message if there was one, and display the listings. */}
                        {displayListingMessage()}
                        <Row className="listings" md="auto">{displayListings()}</Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
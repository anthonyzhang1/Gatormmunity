import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { UserContext } from '../App.js';
import { useNavigate } from 'react-router-dom';
import Listing from "../components/ListingCard";
import { mockListings } from '../components/M3MockData';

export default function Marketplace() {
    /** The default category that displays all listings regardless of category. */
    const ANY_CATEGORY = "Any";
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    /* The states for the filters */
    const [categoryFilter, setCategoryFilter] = useState(ANY_CATEGORY); // by default, no filter is applied
    const [maxPriceFilter, setMaxPriceFilter] = useState("");

    const [categoryDropdownOptions, setCategoryDropdownOptions] = useState([]);
    const [listingData, setListingData] = useState([]); // the listings and their titles, descriptions, etc.

    /** Set the categories in the dropdown such that it only shows the categories that have at least 1 listing. */
    function setCategoryDropdown() {
        // get all the categories from the listings and sort them alphabetically
        const allCategories = mockListings.map((listing) => {
            return listing.category;
        });

        /** Stores the unique categories sorted alphabetically, with `ANY_CATEGORY` as the first option. */
        let uniqueCategories = [...new Set(allCategories)];
        uniqueCategories.sort();
        uniqueCategories.unshift(ANY_CATEGORY);

        setCategoryDropdownOptions(uniqueCategories);
    }

    /** Applies the filters to the listings so that only the listings that match are displayed. */
    function applyFilter(e) {
        e.preventDefault(); // stops the page from refreshing after filtering

        let listings = mockListings; // start with all of the listings

        // only listings that are of the correct category are left in `listings`
        if (categoryFilter !== ANY_CATEGORY) {
            listings = listings.filter((listing) => listing.category === categoryFilter);
        }

        // only listings that are within the max price range are left in `listings`
        if (maxPriceFilter.length > 0) {
            listings = listings.filter((listing) => parseFloat(listing.price) <= parseFloat(maxPriceFilter));
        }

        setListingData(listings);
    }

    /* Use the mock data as our listings and get the category options when the page loads. */
    useEffect(() => {
        setListingData(mockListings)
        setCategoryDropdown();
    }, []);

    if (!userSession) {
        return <h1 className='page-title'>You must be logged in to see this page.</h1>
    } return (
        <div className="marketplace-page">
            <Container className="marketplace-container" fluid>
                <Row>
                    <Col className="filters-col" md="auto">
                        <h2 className="filters-header">Filters</h2>

                        <Form className="filters-form" onSubmit={applyFilter}>
                            {/* Category Dropdown Filter */}
                            <Form.Group className="category-filter mb-3" controlId="marketplace-category">
                                <Form.Label>Category</Form.Label>
                                <Form.Select onChange={e => setCategoryFilter(e.target.value)}>
                                    {/* Lists all the valid categories into the dropdown */}
                                    {categoryDropdownOptions.map((category, index) => {
                                        return (
                                            <option key={index} value={category}>{category}</option>
                                        );
                                    })}
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
                            <Button className="apply-button default-button-color" type="submit">
                                Apply
                            </Button>
                        </Form>
                    </Col>

                    <Col className="listings-col">
                        <h2 className="listings-header">Listings</h2>

                        <Button className="create-button default-button-color" onClick={() => navigate("/create-listing")}>
                            Create Listing
                        </Button>

                        <Row className="listings" md="auto">
                            {listingData.length > 0 && listingData.map((listing) => {
                                return (
                                    <Col className="d-flex align-items-stretch" key={listing.listing_id}>
                                        <Listing listing_id={listing.listing_id} name={listing.name} price={listing.price}
                                            picture={listing.picture}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
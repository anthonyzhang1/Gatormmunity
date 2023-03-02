/* This file holds the code for the How To Create Listing help page, which explains how to create a listing. */

import { howToCreateListing } from '../../components/help/Questions';

export default function HowToCreateListing() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{howToCreateListing.question}</h1>
            <p className="answer">
                To create a listing, you must first be logged in. <br />
                Select "Market" from the navigation bar in the top left, then click on the "Create Listing" button underneath
                the "Marketplace Listings" text. <br /><br />

                On the Create Listing page, simply attach a photo of your item (or something relevant like a selfie if
                you are listing a service), give the listing a title and description, set the desired price and category,
                then click on "Create" to create your listing. You will see your listing once it has been created. <br /><br />

                Be ready to receive direct messages from potential buyers!
            </p>
        </div>
    );
}
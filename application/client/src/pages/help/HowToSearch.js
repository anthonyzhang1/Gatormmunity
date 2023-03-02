/* This file holds the code for the How to Search help page,
 * which explains how one can search for listings, threads, or users. */

import { howToSearch } from '../../components/help/Questions';

export default function HowToSearch() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{howToSearch.question}</h1>
            <p className="answer">
                On Gatormmunity, you can search for listings, threads, or users, if you are logged in. If you are not logged in,
                you can only search for listings.
                To search, type your search terms into the search bar at the top right. <br /><br />

                By default, you will search for listings. You can change what you are searching for by selecting the buttons
                in the left column, titled "Search Options". Select "Search Users" if you want to search for users, for instance.
                You may also specify additional filters, such as searching only listings that do not exceed
                some maximum price, or searching only threads that are in a certain category.
            </p>
        </div>
    );
}
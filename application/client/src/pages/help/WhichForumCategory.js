/* This file holds the code for the Which Forum Category page, which explains what each of the forum categories are for, and
 * which one the user should select for their thread. */

import { whichForumCategory } from '../../components/help/Questions';

export default function WhichForumCategory() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{whichForumCategory.question}</h1>
            <p className="answer">
                When you create a thread, you will be asked to assign your thread a category. On this page, we will explain
                what each of the categories mean, so that you will know which category your thread belongs to.
            </p>

            <h3 className="section">Discussion</h3>
            <p className="answer">
                This category is for threads about things like the news, sports games, i.e. things that you would like to
                discuss with others. As always, please be civil with others.
            </p>


            <h3 className="section">General</h3>
            <p className="answer">
                This category is for threads about college, Gatormmunity, the city of San Francisco, etc. Things that are
                related to academics or the city, because Gatormmunity's purpose is to connect San Francisco State University's
                students.
            </p>

            <h3 className="section">Help</h3>
            <p className="answer">
                This category is for people who are looking for help from other Gatormmunity members,
                e.g. with homework, life advice, or what to eat tonight.
            </p>

            <h3 className="section">Off-Topic</h3>
            <p className="answer">
                This category is a catch-all category for anything and everything as long as the topic does not breach our
                Terms of Service. If you are not sure if your thread would fit in the other categories, then you can put it in
                the Off-Topic category.
            </p>

            <h3 className="section">Promotion</h3>
            <p className="answer">
                This category is for threads where you are trying to advertise your listings, trying to sell things without
                using the Gatormmunity Marketplace, etc. If you want to promote something, do it in this category.
            </p>

            <h3 className="section">Social</h3>
            <p className="answer">
                This category is for threads relating to events, meetups, or finding friends. If your thread is about
                hosting an event, meeting people, or just interacting with others, then this is the category to assign your
                thread to.
            </p>
        </div>
    );
}
/* This file holds the code for the About Us page, which explains what Gatormmunity is all about and
 * shows the team's members and their pictures. */

import AboutUsCard from '../components/about/AboutUsCard';

export default function AboutUs() {
    return (
        <div className="about-us-page">
            <h1 className="page-title">About Us</h1>
            <p className="app-description">
                Gatormmunity is a trading platform and social networking service for San Francisco State University (SFSU).
                Our purpose is to provide SFSU attendees a safer alternative to other trading platforms,
                because on Gatormmunity, you must be a member of SFSU to log in.
            </p>

            <h2 className="about-us-card-div-title">Meet the Team</h2>

            {/* Component to each of our respective about me pages. */}
            <div className='about-us-card-div'>
                <AboutUsCard name="Anthony Zhang" picture="/images/about/Anthony.png" aboutMePageLink="/about-us/anthony" />
                <AboutUsCard name="Mohamed Sharif" picture="/images/about/Mohamed.png" aboutMePageLink="/about-us/mohamed" />
                <AboutUsCard name="Florian Cartozo" picture="/images/about/Florian.png" aboutMePageLink="/about-us/florian" />
                <AboutUsCard name="Marwan Alnounou" picture="/images/about/Marwan.png" aboutMePageLink="/about-us/marwan" />
                <AboutUsCard name="Jose Lopez" picture="/images/about/Jose.png" aboutMePageLink="/about-us/jose" />
            </div>
        </div>
    );
}
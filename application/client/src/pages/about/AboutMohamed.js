/* This file holds the code for the About Mohamed page, which shows Mohamed's message and their picture. */

import { RedirectionWarning } from "../../components/Constants";

export default function AboutMohamed() {
    return (
        <div className="about-me-page">
            <img src="/images/about/Mohamed.png" height="275" width="275" alt="Mohamed" />

            <h1 className='name'>Mohamed Sharif</h1>
            <h3 className='role'>Role: Back End Lead</h3>
            <p className='description'>
                I am a senior at San Francisco State University. I have only 4 classes to graduate.
                I am interested in learning cyber security, block chains, Artificial intelligence, and
                cloud engineering. I am planning to do a remote part time intership. Also, I  enjoy road bikes.
                I recently bought a road bike from France. The road bike is fully carbon and light. It can go up to
                60 miles per hours in a straight road. I have 2 children and have been married for the past 9 years.
                I was originally born in Brazil. Thus, I like steak houses and strong coffee.
            </p>

            <a className='external-link' href="https://www.linkedin.com/in/mohamed-s-47301520b/" target="_blank"
                rel="noopener noreferrer" onClick={RedirectionWarning}
            >
                linkedin
            </a>
        </div>
    );
}
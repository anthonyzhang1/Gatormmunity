/* This file holds the code for the About Florian page, which shows Florian's message and their picture. */

import { RedirectionWarning } from "../../components/Constants";

export default function AboutFlorian() {
    return (
        <div className="about-me-page">
            <img src="/images/about/Florian.png" height="275" width="275" alt="Florian" />

            <h1 className='name'>Florian Cartozo</h1>
            <h3 className='role'>Role: Database Master</h3>
            <p className='description'>
                I'm Florian Cartozo, I'm 21, I come from France and I'm an IT student. <br />
                It's my 4th years. <br />
                I was at Epitech in Marseille for the last 3 years. <br />
                For my 4th year I to choose to come in San Francisco. <br />
                Especially for the city but for the courses too. I also want to improve my english level. <br />
                I love programing and video games. I watch series and animes too. <br />
                During my years at Epitech, I learnt lot of things but I prefer back-end development and mobile development.
            </p>

            <a className='external-link' href="https://github.com/FlorianCartozo" target="_blank" rel="noopener noreferrer"
                onClick={RedirectionWarning}
            >
                My GitHub
            </a>
        </div>
    );
}
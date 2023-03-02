/* This file holds the code for the About Marwan page, which shows Marwan's message and their picture. */

import { RedirectionWarning } from "../../components/Constants";

export default function AboutMarwan() {
    return (
        <div className="about-me-page">
            <img src="/images/about/Marwan.png" height="275" width="275" alt="Marwan" />

            <h1 className='name'>Marwan Alnounou</h1>
            <h3 className='role'>Role: Front End Lead</h3>
            <p className='description'>
                My name is Marwan and I am a senior at SFSU, I enjoy hiking, and being outdoor. <br />
                My interests are languages, cars and technology. <br />
                Fun fact about me, I speak three languages fluently.
            </p>

            <a className='external-link' href="https://github.com/marwanalnounou" target="_blank" rel="noopener noreferrer"
                onClick={RedirectionWarning}
            >
                My GitHub
            </a>
        </div>
    );
}
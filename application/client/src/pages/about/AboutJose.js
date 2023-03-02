/* This file holds the code for the About Jose page, which shows Jose's message and their picture. */

import { RedirectionWarning } from "../../components/Constants";

export default function AboutJose() {
    return (
        <div className="about-me-page">
            <img src="/images/about/Jose.png" height="275" width="275" alt="Jose" />

            <h1 className='name'>Jose Lopez</h1>
            <h3 className='role'>Role: GitHub Master</h3>
            <p className='description'>
                Hello, My name is Jose Lopez, and welcome to my about me section on my page. <br />
                I am a very patient guy and like to work hard for what I like, I like to read comic books, and manga. <br />
                I also like to watch Science fiction, and scary movies or shows, and I do believe in aliens. <br />
                There is no such thing as a ghost. The universe intrigues me, <br />
                and I really like astronomy and the laws of physics, <br />
                the thought of time travel and humanity reaching the next step of acheaving faster then light speed someday.
            </p>

            <a className='external-link' href="https://github.com/Jlopz12" target="_blank" rel="noopener noreferrer"
                onClick={RedirectionWarning}
            >
                My GitHub
            </a>
        </div>
    );
}
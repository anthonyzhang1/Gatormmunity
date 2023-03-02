/* This file holds the code for the About Anthony page, which shows Anthony's message and their picture. */

import { RedirectionWarning } from "../../components/Constants";

export default function AboutAnthony() {
    return (
        <div className="about-me-page">
            <img src="/images/about/Anthony.png" height="275" width="275" alt="Anthony" />

            <h1 className='name'>Anthony Zhang</h1>
            <h3 className='role'>Role: Team Lead</h3>
            <p className='description'>
                Hello, and welcome to my page. <br /><br />

                I love Japan, Japanese video games, Japanese music, the Japanese language, Japanese food,
                anime, and manga. <br />
                Please feel free to talk to me about any of the aforementioned topics. <br /><br />

                My picture is a barrel, also known as 樽 or бочка.
            </p>

            <a className='external-link' href="https://github.com/anthonyzhang1" target="_blank" rel="noopener noreferrer"
                onClick={RedirectionWarning}
            >
                My GitHub
            </a>

            <a className='external-link' target="_blank" rel="noopener noreferrer" onClick={RedirectionWarning}
                href="https://www.youtube.com/channel/UC4otIQYiK8iG2oT-XissEWg/videos"
            >
                My YouTube Channel
            </a>
        </div>
    );
}
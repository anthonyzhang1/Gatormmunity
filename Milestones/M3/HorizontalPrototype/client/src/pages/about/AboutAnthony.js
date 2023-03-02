import { RedirectionWarning } from '../../components/Warnings';

export default function AboutAnthony() {
    return (
        <div className="about-me-page">
            <img className='my-image' src="/images/about/Anthony.png" alt="Anthony" />

            <h1 className='my-name'>Anthony Zhang</h1>
            <h3 className='my-role'>Role: Team Lead</h3>
            <p className='my-description'>
                Hello, and welcome to my page. <br /><br />

                I love Japan, Japanese video games, Japanese music, the Japanese language, Japanese food,
                anime, and manga. <br />
                Please feel free to talk to me about any of the aforementioned topics. <br /><br />

                My picture is a barrel, also known as 樽 or бочка.
            </p>
            
            <a className='my-external-link' onClick={RedirectionWarning} href="https://github.com/anthonyzhang1"
                target="_blank" rel="noopener noreferrer"
            >
                My GitHub
            </a>
            <a className='my-external-link' onClick={RedirectionWarning} target="_blank" rel="noopener noreferrer"
                href="https://www.youtube.com/channel/UC4otIQYiK8iG2oT-XissEWg/videos"
            >
                My YouTube Channel
            </a>
        </div>
    );
}
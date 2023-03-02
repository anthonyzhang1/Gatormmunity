import { RedirectionWarning } from "../../components/Constants";

export default function AboutJose() {
    return (
        <div className="about-me-page">
            <img className='my-image' src="/images/about/Jose.png" alt="Jose" />

            <h1 className='my-name'>Jose Lopez</h1>
            <h3 className='my-role'>Role: GitHub Master</h3>
            <p className='my-description'>
                Hello, My name is Jose Lopez, and welcome to my about me section on my page.<br></br>
                I am a very patient guy and like to work hard for what I like, I like to read comic books, and manga.<br></br>
                I also like to watch Science fiction, and scary movies or shows, and I do believe in aliens.<br></br>
                There is no such thing as a ghost. The universe intrigues me,<br></br>
                and I really like astronomy and the laws of physics,<br></br>
                the thought of time travel and humanity reaching the next step of acheaving faster then light speed someday.<br></br>
            </p>

            <a className='my-external-link' onClick={RedirectionWarning} href="https://github.com/Jlopz12"
                target="_blank" rel="noopener noreferrer"
            >
                My GitHub
            </a>
        </div>
    );
}
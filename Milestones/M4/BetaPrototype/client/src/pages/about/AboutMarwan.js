import { RedirectionWarning } from "../../components/Constants";

export default function AboutMarwan() {
    return (
        <div className="about-me-page">
            <img className='my-image' src="/images/about/Marwan.png" alt="Marwan" />

            <h1 className='my-name'>Marwan Alnounou</h1>
            <h3 className='my-role'>Role: Front End Lead</h3>
            <p className='my-description'>
                My name is Marwan and I am a senior at SFSU, I enjoy hiking, and being outdoor.<br></br>
                My interests are languages, cars and technology.<br></br>
                Fun fact about me, I speak three languages fluently.<br></br>
            </p>

            <a className='my-external-link' onClick={RedirectionWarning} href="https://github.com/marwanalnounou"
                target="_blank" rel="noopener noreferrer"
            >
                My GitHub
            </a>
        </div>
    );
}
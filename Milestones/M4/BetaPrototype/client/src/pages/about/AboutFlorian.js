import { RedirectionWarning } from "../../components/Constants";

export default function AboutFlorian() {
    return (
        <div className="about-me-page">
            <img className='my-image' src="/images/about/Florian.png" alt="Florian" />

            <h1 className='my-name'>Florian Cartozo</h1>
            <h3 className='my-role'>Role: Database Master</h3>
            <p className='my-description'>
                I'm Florian Cartozo, I'm 21, I come from France and I'm an IT student.<br></br>
                It's my 4th years.<br></br>
                I was at Epitech in Marseille for the last 3 years.<br></br>
                For my 4th year I to choose to come in San Francisco.<br></br>
                Especially for the city but for the courses too. I also want to improve my english level.<br></br>
                I love programing and video games. I watch series and animes too.<br></br>
                During my years at Epitech, I learnt lot of things but I prefer back-end development and mobile development.<br></br>
            </p>

            <a className='my-external-link' onClick={RedirectionWarning} href="https://github.com/FlorianCartozo"
                target="_blank" rel="noopener noreferrer"
            >
                My GitHub
            </a>
        </div>
    );
}
import { RedirectionWarning } from '../../components/Warnings';

export default function AboutMohamed() { // change this to the filename, e.g. AboutAnthony
    return (
        <div className="about-me-page">
            {/* Change "Default Photo.png" to the name of your photo, e.g. Anthony.png.
              * Please make sure you have the rights to use any posted photo.
              * Then, change the alt attribute so that it has your first name, e.g. alt="Anthony". */}
            <img className='my-image' src="/images/about/Mohamed.png" alt="Mohamed" />

            <h1 className='my-name'>Mohamed Sharif</h1>
            <h3 className='my-role'>Role: Back End Lead</h3>
            <p className='my-description'>
                       I am a senior at San Francisco State University. I have only 4 classes to graduate.
                       I am interested in learning cyber security, block chains, Artificial intelligence, and
                       cloud engineering. I am planning to do a remote part time intership. Also, I  enjoy road bikes.
                       I recently bought a road bike from France. The road bike is fully carbon and light. It can go up to 
                       60 miles per hours in a straight road. I have 2 children and have been married for the past 9 years.
                       I was originally born in Brazil. Thus, I like steak houses and strong coffee.
                </p>
            
            {/* You do not need to include any links. You are free to delete the below <a> code.
              * You may also choose to add more links by copying and pasting the below <a> code onto a new line. */}
            <a className='my-external-link' onClick={RedirectionWarning} href="https://www.linkedin.com/in/mohamed-s-47301520b/"
              target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
        </div>
    );
}
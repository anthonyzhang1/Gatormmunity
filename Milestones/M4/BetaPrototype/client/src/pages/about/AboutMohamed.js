import { RedirectionWarning } from "../../components/Constants";

export default function AboutMohamed() {
	return (
		<div className="about-me-page">
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

			<a className='my-external-link' onClick={RedirectionWarning} href="https://www.linkedin.com/in/mohamed-s-47301520b/"
				target="_blank" rel="noopener noreferrer"
			>
				linkedin
			</a>
		</div>
	);
}
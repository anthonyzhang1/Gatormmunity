/* This file holds the component that shows the user a clickable link to one of the Help page's questions.
 * Depending on the props passed to this component, the link may open a new tab instead of redirecting in the same tab. */

import { Link } from 'react-router-dom';

export default function QuestionLink(props) {
    // question: The question that will be shown to the user
    // answerLink: The link to the help page containing the answer to the question
    // openNewTab: Whether to open the link in a new tab
    const { question, answerLink, openNewTab } = props;

    if (openNewTab) { // Open the answer page in a new tab
        return <Link className="question-link" to={answerLink} target="_blank" rel="noopener noreferrer">{question}</Link>;
    } else { // Do not open in a new tab
        return <Link className="question-link" to={answerLink}>{question}</Link>;
    }
}
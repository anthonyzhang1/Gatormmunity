import { Link } from 'react-router-dom';

export default function QuestionLink(props) {
    // question: The question that will be shown to the user
    // answerLink: The link to the help page containing the answer to the question
    const { question, answerLink } = props;

    return (
        // Open the answer page in a new tab
        <Link className="question-link" to={answerLink} target="_blank" rel="noopener noreferrer">
            {question}
        </Link>
    );
}
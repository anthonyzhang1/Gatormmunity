import QuestionLink from "./QuestionLink";

export default function HelpfulLinksList(props) {
    // questions: An array of questions from the Questions.js file.
    const { questions } = props;

    return (
        <div className='helpful-links-list-component'>
            <h4 className="helpful-links-header">Helpful Links</h4>

            {questions.map((question, index) => {
                return (
                    <QuestionLink key={index} question={question.question} answerLink={question.answerLink} />
                );
            })}
        </div>
    );
}
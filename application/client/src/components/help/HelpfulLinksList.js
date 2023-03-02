/* This file holds the component which displays a small table containing helpful links.
 * These helpful links are shown when the user is creating a group, thread, listing, or viewing a listing. */

import QuestionLink from "./QuestionLink";

export default function HelpfulLinksList(props) {
    // questions: An array of questions from the Questions.js file.
    const { questions } = props;

    return (
        <div className='helpful-links-list-component'>
            <h4 className="helpful-links-header">Helpful Links</h4>
            
            {/* Maps each of the questions in the `questions` array to a clickable question link. Clicking on a question link
              * opens a new tab containing the answer to the question. */}
            {questions.map((question, index) => {
                return (
                    <QuestionLink key={index} question={question.question} answerLink={question.answerLink} openNewTab={true} />
                );
            })}
        </div>
    );
}
/* This file handles the display of the Help page, which shows various questions that a user might have. Users can click
 * on a question to view the answer and get help. */

import QuestionLink from '../components/help/QuestionLink';
import * as questions from '../components/help/Questions';

export default function Help() {
    return (
        <div className="help-page">
            <h1 className="page-title">Help and FAQs</h1>

            {/* General Questions */}
            <h3 className="section-title">General</h3>
            <div className="questions-group">
                <QuestionLink question={questions.cannotLogin.question} answerLink={questions.cannotLogin.answerLink} />
                <QuestionLink question={questions.howToSearch.question} answerLink={questions.howToSearch.answerLink} />
                <QuestionLink question={questions.report.question} answerLink={questions.report.answerLink} />
            </div>

            {/* Forums Questions */}
            <h3 className="section-title">Forums</h3>
            <div className="questions-group">
                <QuestionLink question={questions.whatAreThreads.question} answerLink={questions.whatAreThreads.answerLink} />
                <QuestionLink question={questions.whichForumCategory.question}
                    answerLink={questions.whichForumCategory.answerLink}
                />
            </div>

            {/* Marketplace Questions */}
            <h3 className="section-title">Marketplace</h3>
            <div className="questions-group">
                <QuestionLink question={questions.howToCreateListing.question}
                    answerLink={questions.howToCreateListing.answerLink}
                />
                <QuestionLink question={questions.meetingBuyerSeller.question}
                    answerLink={questions.meetingBuyerSeller.answerLink}
                />
            </div>

            {/* Groups Questions */}
            <h3 className="section-title">Groups</h3>
            <div className="questions-group">
                <QuestionLink question={questions.joinGroup.question} answerLink={questions.joinGroup.answerLink} />
                <QuestionLink question={questions.groupPurpose.question} answerLink={questions.groupPurpose.answerLink} />
                <QuestionLink question={questions.groupMemberManagement.question}
                    answerLink={questions.groupMemberManagement.answerLink}
                />
            </div>

            {/* Messaging Questions */}
            <h3 className="section-title">Messaging</h3>
            <div className="questions-group">
                <QuestionLink question={questions.messageUser.question} answerLink={questions.messageUser.answerLink} />
            </div>
        </div>
    );
}
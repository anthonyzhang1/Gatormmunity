import { reportUser } from '../../components/help/Questions';

export default function ReportUser() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{reportUser.question}</h1>
            <p className="answer">
                If you believe a user has breached our Terms of Service, please contact us using the contact us link
                in the footer. Tell us what the perpetrator did and we will review the report and will take the
                necessary actions to ensure the safety and happiness of our users.
            </p>
         </div>
    );
}
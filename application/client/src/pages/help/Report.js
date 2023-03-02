/* This file holds the code for the Reporting Something or Someone help page, which explains how one can
 * report someone or something to the Gatormmunity administrators. */

import { report } from '../../components/help/Questions';

export default function Report() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{report.question}</h1>
            <p className="answer">
                If you believe a user, listing, thread, etc. has breached our Terms of Service,
                please contact us using the contact us link in the footer.
                Tell us what the perpetrator did and we will review the report and will take the
                necessary actions to ensure the safety and happiness of our users. <br /><br />

                We will not disclose your identity to any parties who have breached the Terms of Service.
            </p>
         </div>
    );
}
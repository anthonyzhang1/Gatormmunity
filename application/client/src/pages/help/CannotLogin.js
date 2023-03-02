/* This file holds the code for the Cannot Login help page, which explains why a user might not have been able to log in. */

import { cannotLogin } from '../../components/help/Questions';

export default function CannotLogin() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{cannotLogin.question}</h1>
            <p className="answer">
                There are a number of reasons why you cannot login, not limited to: (1) you entered the wrong login credentials,
                (2) your account has not yet been approved, or (3) your account has been banned.
            </p>

            <h3 className="section">(1) Wrong Login Credentials</h3>
            <p className="answer">
                You can only log in if you enter the credentials to an existing account. <br />
                If you do not have an account yet, please consider registering for one by pressing the Register button
                in the navigation bar. If you have forgotten your password, please click on the "Forgot Password" option
                for instructions on how to reset your account's password.
            </p>

            <h3 className="section">(2) Account Not Approved</h3>
            <p className="answer">
                If you have just registered for a Gatormmunity account, you will not be able to login until your account
                has been approved by one of our moderators. We will send you an email when your account has been
                approved or disapproved, so please be patient.
            </p>

            <h3 className="section">(3) Account Banned</h3>
            <p className="answer">
                If you have been banned by a Gatormmunity moderator or admin, you will no longer be able to log in.
                If you believe your ban has been made in error, please contact us using the contact us button in the footer,
                and we will review your request for a ban appeal.
            </p>
        </div>
    );
}
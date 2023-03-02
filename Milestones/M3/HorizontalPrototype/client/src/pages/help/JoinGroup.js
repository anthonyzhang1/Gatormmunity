import { joinGroup } from '../../components/help/Questions';

export default function JoinGroup() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{joinGroup.question}</h1>
            <p className="answer">
                To join a group manually, you can go to the group's page and click on "Join Group". <br />
                If you are invited to a group, you can click on the link and you will automatically join the group.
            </p>
         </div>
    );
}
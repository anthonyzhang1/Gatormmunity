import { whichForumCategory } from '../../components/help/Questions';

export default function WhichForumCategory() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{whichForumCategory.question}</h1>
            <p className="answer">
                When you create a thread, you will be asked to assign your thread a category. On this page, we will explain
                what each of the categories mean, so that you will know which category your thread belongs to.
            </p>

            <h3 className="section">General</h3>
            <p className="answer">
                This category is a catch-all category for anything and everything as long as the topic does not breach our
                Terms of Service. If you do not wish to specify your thread's category, you can use the General category.
            </p>

            <h3 className="section">Social</h3>
            <p className="answer">
                This category is for threads relating to events, meetups, and making friends. If your thread is about
                hosting an event, meeting people, or just interacting with others, this is the category to assign your
                thread to.
            </p>

            <h3 className="section">Questions</h3>
            <p className="answer">
                This category is for questions you have that you would like to have answered. For example, the questions
                can be about asking for help with assignments, seeking advice, or asking what other people think about
                something. If you feel your thread matches the examples, then place your thread in the Questions category!
            </p>
         </div>
    );
}
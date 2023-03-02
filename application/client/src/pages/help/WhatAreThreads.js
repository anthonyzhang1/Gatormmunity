/* This file holds the code for the What Are Threads help page, which explains what a forum thread is. */

import { whatAreThreads } from '../../components/help/Questions';

export default function WhatAreThreads() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{whatAreThreads.question}</h1>
            <p className="answer">
                Threads, also referred to as forum threads, are a group/collection of individual posts. <br />
                You can think of threads as a conversation between users, where the person who created the thread is the one
                who started the conversation, and the posts in the thread as people's replies to the conversation.
            </p>
        </div>
    );
}
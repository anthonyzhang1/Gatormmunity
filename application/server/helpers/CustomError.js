/* This file contains a custom Error class that lets us give specific error messages to the user. */

/** CustomError lets us return a custom error message to the front end.
  * We reserve regular Errors for errors that are not the user's fault, e.g. server or database errors.
  * We use CustomErrors if the fault is the user's and we want to be specific with our error message. */
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }
}

module.exports = CustomError;
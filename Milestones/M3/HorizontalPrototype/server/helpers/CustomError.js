/** A custom error that lets us return an error message to the front end. */
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }
}

module.exports = CustomError;
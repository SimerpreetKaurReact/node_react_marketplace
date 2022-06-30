class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //message is the only param that built in error excepts
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
///operational errors: predictable errors, we need to handle them in advance
//eg: invalid path, invalid user input, failed to connect to server,failed to connect to database
//eg: request tmeout
// programming errors: bugs that developers introduced into our code
// above handler is taking care of operational errors

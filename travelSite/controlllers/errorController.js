const { default: AppError } = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${
    err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  }, Please use another field value  `;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${error.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('invalid token, please login again', 401);
const hahandleJWTExpiredError = (err) =>
  new AppError('your token expired, login again');
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  //operational or trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
    //programming or other unknown error
  } else {
    //1.log error: use some logging library or store in db
    console.log('ERROR', err);

    res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};
module.exports = (err, req, res, next) => {
  //error handling middleware
  console.log(err.stack);
  err.statusCode = err.statusCode || 500; //for un predicted operational error we will need default status code and status
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = hahandleJWTExpiredError(error);
    sendErrorProd(error, res);
  }
};

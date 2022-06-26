const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controlllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const usersRoute = require('./routes/userRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//to open elements in public folder
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello from apps' });
});
app.post('/', (req, res) => {
  res.status(200).send('hi');
});

//3)Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRoute);
app.all('', usersRoute);

//201 means created
//204 means no data response
app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello from apps' });
});
app.post('/', (req, res) => {
  res.status(200).send('hi');
});
//ERROR HANDLER

app.all('*', (req, res, next) => {
  // const err = new Error(`cant find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  next(AppError(`cant find ${req.originalUrl} on this server`, 404));
  //if something is passesd to next it is assumed to be error which is sent to error handler middleware
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant find ${req.originalUrl} on this server`,
  // });
});
//error handler middleware
app.use(globalErrorHandler);
//rest representation state
//seperate API into logical resoursces,
// expose structural resource based URL
//use http methids
//patch send only part of the object that is updated, put sends back complete object
// send data as json
//stateless rest Apis
module.exports = app;

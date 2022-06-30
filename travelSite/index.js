const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controlllers/errorController');
const routes = require('./routes');

const app = express();

//Global middleware
//SEt security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this ip, please try again',
});

//body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization against xss:no sql query injection
app.use(mongoSanitize());
//removes $ signs in body s this wont work
//removes html code from body
app.use(xss());
//remove parameter pollution
app.use(
  hpp({ whitelist: ['duration', 'ratingsQuantity', 'difficulty', 'price'] })
);
//middleware
app.use(express.json());
//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(cors());
// Body parser
app.use(express.urlencoded({ extended: false }));

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
app.use('/api/v1', limiter, routes);
// app.all('', usersRoute);

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

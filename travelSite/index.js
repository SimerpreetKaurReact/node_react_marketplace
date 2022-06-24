const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const usersRoute = require('./routes/userRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//middleware
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
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
//201 means created
//204 means no data response
app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello from apps' });
});
app.post('/', (req, res) => {
  res.status(200).send('hi');
});

//4)Start the server

//rest representation state
//seperate API into logical resoursces,
// expose structural resource based URL
//use http methids
//patch send only part of the object that is updated, put sends back complete object
// send data as json
//stateless rest Apis
module.exports = app;

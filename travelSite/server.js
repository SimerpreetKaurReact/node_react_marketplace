const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');

dotenv.config({ path: './config.env' });
// const db = process.env.DATABASE_GLOBAL.replace(
//   'PASSWORD',
//   process.env.DATABASE_PASSWORD
// );
mongoose
  .connect(
    process.env.DATABASE_LOCAL
    // {
    // //.connect(db, {
    // useNewUrlParse: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    //}
  )
  .then((con) => {
    console.log('error', con.connection);
    console.log('db connection succesful');
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('app is running on port 3000');
});

//npm i eslint prettier eslint-config-prettier eslint-plugin-prettier
//mongooe is a obhect data modelling library for mongo and node ie a higher level of abstraction
//gives additional mongo db interaction
//schemas, easy data validations, simple query api, middleware
//sxhema is where we model our data by describing the structure of the data, defallt values and validations
//model is a wrapper for the schema providing an interface to the database for crud operations

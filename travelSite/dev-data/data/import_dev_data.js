const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../model/tour');

dotenv.config({ path: './config.env' });

// const db = process.env.DATABASE.replace(
//   'PASSWORD',
//   process.env.DATABASE_PASSWORD
// );
console.log(process.env.DATABASE_LOCAL);
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
  })
  .catch((err) => console.log(err));
// mongoose
//   .connect(process.env.DATABASE_LOCAL)
//   .then((con) => {
//     console.log(con.connection);
//     console.log('db connection succesful');
//   })
//   .catch((err) => console.log(err));
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
//Read json file

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully created');
  } catch (err) {
    console.log(err);
  }
};
importData();
//Delete data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany(tours);
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  importData();
  process.exit();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
//node file path --import

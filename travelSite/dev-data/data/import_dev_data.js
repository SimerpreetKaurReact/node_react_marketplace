const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../model/tour');

dotenv.config({ path: './config.env' });

// const db = process.env.DATABASE.replace(
//   'PASSWORD',
//   process.env.DATABASE_PASSWORD
// );
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    //.connect(db, {
    useNewUrlParse: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connection);
    console.log('db connection succesful');
  });

//Read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully created');
  } catch (err) {
    console.log(err);
  }
};
//Delete data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany(tours);
    console.log('Data successfully deleted');
    process.exit();
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

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a dureation '],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have agroup size'],
  },
  difficulty: {
    type: Number,
    required: [true, ['A tour must habve a difficulty level']],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },

  price: {
    type: Number,
    require: [true, 'A tour must have a price'],
  },
  priceDiscout: Number,
  summary: { type: String, trim: true },
  //trim will remove white space
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// const romeTour = new Tour({
//   name: 'the forest hill',
//   rating: 4.7,
//   price: 759,
// });
// romeTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('error', err));
//MVC Architecture
//model:data,bussiness logic
// controller : application logic(only implementation , works as bridge between bussiness logic and view)
//view:presentaion logic()

///request==> router==?controller
//offload as much logic as possible into the models and keep the controllers simpler and lean

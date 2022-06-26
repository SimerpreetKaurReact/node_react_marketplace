const mongoose = require('mongoose');
const slugify = require('slugify');
//use validator library for vlaidation
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [
        40,
        'tour name must have less that or equal to 40 charachters',
      ],
      minlength: [5, 'tour name must have greater or equal 5 charachters'],
      //   validate: [validator.isAlpha,'tour name must only contain charachters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a dureation '],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have agroup size'],
    },
    difficulty: {
      type: String,
      required: [true, ['A tour must habve a difficulty level']],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Dificulty has to be easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be minimum 1'],
      max: [5, 'rating must be max 5'],
    },

    ratingsQuantity: { type: Number, default: 0 },

    price: {
      type: Number,
      require: [true, 'A tour must have a price'],
    },
    priceDiscout: {
      type: Number,
      validate: {
        validator: function (val) {
          //THIS ONLY POINTS TO CURRENT DOC ON NEW DOC CREATION WONT WORK FOR UPDATE
          return val < this.price;
        },
        message: `Dicounted proce ({VALUE}) should be below regular price`,
      },
    },
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

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virutals: true },
    toObject: { virutals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//1)document middleware: runs befor .save() .create /// WONT WORK FOR UPDATE
//it will not run before insertMany()
tourSchema.pre('save', function (next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// eslint-disable-next-line prefer-arrow-callback
tourSchema.pre('save', function (next) {
  console.log('Will save document');
  next();
});
//after pre, will not have this, will have finished doc/multiple pre post are possible

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//2)Query middleware: runs before find
//since'find ' will not work for findById,findOne so for that using regex
tourSchema.pre(/^find/, function (next) {
  //tourSchema.pre('find', function (next) {

  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});
//aggregation middleware
tourSchema.pre('aggregate', function (docs, next) {
  ///this here will now poitn to current aggregation
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());

  next();
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

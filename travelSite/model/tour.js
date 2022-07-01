const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./user');
//use validator library for vlaidation
// const validator = require('validator');
//model is a blueprint to create doocuments
//models are created out of schema
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
      set: (val) => Math.round(val * 10) / 10, //round will round 4.6666 to 5 but we want 4.5
      //so multiply the value 10 and get 46.66 then when it rounds it to 47 then divide by 10
    },

    ratingsQuantity: { type: Number, default: 0 },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscout: {
      type: Number,
      validate: {
        validator: function (val) {
          //THIS ONLY POINTS TO CURRENT DOC ON NEW DOC CREATION, it  WONT WORK FOR UPDATE
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
    startLocation: {
      //geo json
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } //to get virtual property in our output
);
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//access patterns help in setting indexes, since each index takes space
//read write pattern of documents
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//virtual field is above duration week where a field is virtually populated
//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
//1)document middleware: runs befor .save() .create /// WONT WORK FOR UPDATE
//it will not run before insertMany()
tourSchema.pre('save', function (next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
//embedding guide route
// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

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

//works for every thing that starts with find
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangedAt' });

  next();
});

//aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   ///this here will now poitn to current aggregation object
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());

//   next();
// });
//weill run only post find  has already completed
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
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

const { default: mongoose } = require('mongoose');
const Tour = require('./tour');

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virutals: true } }
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//preventing duplicate reviws ie 1 user can create 1 review for 1 tour
reviewSchema.virtual('durationWeeks').get(function () {
  return this.rating;
});

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'tour', select: 'name' }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });
//this will cause a chain of poupulate now tha we have added a virtual populate in tours
//with tours virtual populating reviews and then review agin populating tour
//to avoid that we will just populate user here
reviewSchema.statics.calculateAverage = async (tourId) => {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nQuantity: { $sum: 1 },
        nAverage: { $avg: ' $rating ' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].nAverage,
      ratingsQuantity: stats[0].nQuantity,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post('save', function () {
  this.constructor.calculateAverage(this.tour);
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
//similarly upadating ratings average while updating review or deleting a review
//findBYIdandupdate, findbyIdand delete
//here we wil not have access to document middleware but to query middleware
reviewSchema.pre(/^findOneand/, async function (next) {
  //executing the query will give access to  document
  this.r = await this.findOne();
  next();
  //this will give us tour id in post middleware
});
reviewSchema.post(/^findOneand/, async function () {
  //await this.findOne() does not work here since the query has already executed
  await this.r.constructor.calculateAverage(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

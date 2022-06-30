const { default: mongoose } = require('mongoose');

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
      ref: 'Usur',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virutals: true } }
);
reviewSchema.virtual('durationWeeks').get(function () {
  console.log('within');
  return this.rating;
});

reviewSchema.pre(/^find/, function (next) {
  this.populate('tour');
  next();
});
reviewSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

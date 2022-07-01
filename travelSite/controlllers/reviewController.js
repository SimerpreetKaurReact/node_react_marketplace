const Review = require('../model/reviewModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handleFactory');

exports.getAllReviews = getAll(Review);

// exports.getAllReviews = catchAsync(async (req, res) => {
//   const features = new APIFeatures(Review.find(filter), req.query)
//     .filter()
//     .sort()
//     .limit()
//     .paginate();

//   const reviewsList = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: reviewsList.length,
//     data: { reviewsList },
//   });
// });
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};
exports.createReview = createOne(Review);

// exports.createReview = catchAsync(async (req, res, next) => {
//   console.log(req.params.tourId, req.user, req.query);

//   const review = await Review.create(req.body);

//   res.status(201).json({ status: 'success', data: { review } });
// });
exports.deleteReview = deleteOne(Review);

exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);

const Review = require('../model/reviewModel');
const APIFeatures = require('../utils/apifeatures');
const { default: AppError } = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const reviewsList = await features.query;

  res.status(200).json({
    status: 'success',
    results: reviewsList.length,
    data: { reviewsList },
  });
  res.status(200).json({ status: 'success', message: reviewsList });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({ status: 'success', data: { review } });
});
exports.getReview = () => {};
exports.updateReview = () => {};
exports.deleteReview = () => {};

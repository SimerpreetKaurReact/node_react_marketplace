const express = require('express');
const { protect, restrictTo } = require('../controlllers/authController');

const router = express.Router({ mergeParams: true });
//each route has access to its own params only, so for handling nested params, set merge params to true
const {
  getAllReviews,
  setTourUserIds,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} = require('../controlllers/reviewController');

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;

const express = require('express');

const router = express.Router();
const { protect, restrictTo } = require('../controlllers/authController');
const {
  getTour,
  getAllTours,
  updateTours,
  deleteTours,
  createTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controlllers/tourController');
const reviewRouter = require('./reviewRoutes');
//nested routes handling
//POST /tour/:tourid/review
//GET /tour/:tourid/review
//GET /tour/:tourid/review/reviewid
// router
//   .route('/:tourId/review')
//   .post(protect, restrictTo('user', 'admin'), createReview);

// the above should actually come in review router instead of here
//we want to open tours provided by the company to the public, so any other website can see what all tours we provide
//so we can open any restriction to get, get all routes
router.use('/:tourId/review', reviewRouter);
//2) Route handleres
//router.param('id', checkID);//middleware example
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTours
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTours);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'l ead-guide'), createTour);

module.exports = router;

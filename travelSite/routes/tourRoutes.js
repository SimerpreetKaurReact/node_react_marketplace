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
} = require('../controlllers/tourController');
//2) Route handleres
//router.param('id', checkID);//middleware example
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTours)
  .delete(protect, restrictTo('admin'), deleteTours);
router.route('/').get(protect, getAllTours).post(createTour);

module.exports = router;

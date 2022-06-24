const express = require('express');
const router = express.Router();

const {
  getTour,
  getAllTours,
  updateTours,
  deleteTours,
  createTour,
  aliasTopTours,
} = require('../controlllers/tourController');
//2) Route handleres
//router.param('id', checkID);//middleware example
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/:id').get(getTour).patch(updateTours).delete(deleteTours);
router.route('/').get(getAllTours).post(createTour);

module.exports = router;

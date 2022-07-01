const express = require('express');

const router = express.Router();
const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controlllers/authController');
const {
  getAllUsers,
  getUser,
  createUsers,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controlllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);

router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

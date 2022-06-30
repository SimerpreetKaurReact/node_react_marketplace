const express = require('express');

const router = express.Router();
const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protect,
  updatePassword,
} = require('../controlllers/authController');
const {
  getAllUsers,
  getUser,
  createUsers,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controlllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

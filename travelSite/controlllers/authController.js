const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //REmove the password from the output being sent tot he client
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: user },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: { user: newUser },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email password exists
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  //check if user exists && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email and password', 401));
  }
  //if everything is ok, send token to client, dont send password
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({ status: 'success', token });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in, Please log in to get access')
    );
  }
  //2)verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3)check if user still exists

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('user belonging to token does not exist', 404));
  }
  //4)check if user changed password, after token
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('password has been changed !!, login again', 401));
  }
  //grant access to protected user
  req.user = freshUser;
  next();
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permisions to perform this action', 403)
      );
      //403 is forbidden
    }
  };
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user with email, if user not found send error
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user not found with given email', 404));
  }
  //generate the random reset token
  const resetToken = await user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  //send the user mail
  const resetURL = `${req.protocol}://${req.get(
    `host`
  )}/api/vi/users/resetPassword/${resetToken}`;
  const message = `Forgot our password? Submit a  PATCH request with your new password 
  and passwordConfirm to ${resetURL}. \n If you didnt forget your password please ignore this mail`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your passord reset token valid for 10 min',
      message,
    });
    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending email, try again later', 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)if token has not expired and there is user set the new password\
  if (!user) {
    return next(
      new AppError('user not found  or password reset token expired', 400)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //3) update changedPasswordAt property for the user
  await user.save();
  //4)Log the user in and send the json web token back to the client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({ status: 'success', token });
});
exports.updatePassword = async (req, res, next) => {
  //get user from collection
  const { id, passwordCurrent, password, passwordConfirm } = req.body;
  const user = await User.findById({ _id: id }).select('+password');
  //check if posted password is correct
  if (!user || !(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your password is incorrect', 401));
  }
  //if so, update password
  user.password = password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //USer.findByIDand update will not work as intended
  //log user in, send jwt
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({ status: 'success', token });
};

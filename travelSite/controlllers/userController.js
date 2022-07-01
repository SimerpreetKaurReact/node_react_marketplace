const User = require('../model/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, getAll } = require('./handleFactory');

const filteredUpdates = (body, ...allowedFields) => {
  const newObj = {};
  Object.values(body).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = body[ele];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();
//   res
//     .status(200)
//     .json({ status: 'success', results: users.length, data: { users } });
// });
exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user post password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );
  //update user document
  const user = await User.findByIdAndUpdate(
    req.user.id,
    filteredUpdates(req.user, 'name', 'email'),
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'succes', data: null });
});
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not defined! Please use signup instesd',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);

//Do not update password with this
exports.updateUser = updateOne(User);

exports.deleteUser = deleteOne(User);
//above two are only fpor admin

const User = require('../model/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, getAll } = require('./handleFactory');
const multer = require('multer');
const sharp = require('sharp');

// const upload = multer({ dest: 'public/img/users' });
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
//storing image as buffer then using sharp to scale
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('file type should be image', 404), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.userUpload = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});
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
  console.log(req.file);
  console.log(req.body);
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );
  //update user document
  const filterdBody = filteredUpdates(req.user, 'name', 'email');
  if (req.file) filterdBody.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });
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

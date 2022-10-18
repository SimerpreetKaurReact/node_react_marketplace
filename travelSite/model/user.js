const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  photo: { type: String, default: 'default.jpg' },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: 8,
    select: false, //so that pasword is never sent as output
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    minlength: 8,
    validate: {
      //this.only works on save/create, dont use regular update
      validator: function (el) {
        return el === this.password;
      },
      message: 'password and confirm password dont match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});
userSchema.pre('save', async function (next) {
  //only run this function if password was modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//this functions is gonna run before the document is saved
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
//Instance method
userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};
//instance methods
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  /// now sending via email an unencrypted user token
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
//jwt(stateless solution for session)
//if user mail, password is correct, server creates a unique jwt and sends it back to user, user stores
//this jwt in local storage/ cookies. this jwt token is not stored anywhere on the server
//each time this user wants some info, he will send this token to server, server will verify if this token is valid or not
// if it is valid then protected data is sent back

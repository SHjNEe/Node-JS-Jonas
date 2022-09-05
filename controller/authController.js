const { promisify } = require("util");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Send back token and store with cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  //Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
    headers: { "Content-Type": "application/json" },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createAndSendToken(newUser, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check email and password is existing
  if (!email || !password) {
    next(new AppError("Please provide a valid email and password", 400));
  }
  //2) Check email and password is correct
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect or and password", 401));
  }
  //3) If OK send token to client
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //Geting token and check of it's there
  req.requestTime = new Date().toISOString();
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Invalid token or you are not login", 401));
  }
  // Verifycations tokens
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("User not found", 401));
  }

  // Check if user changed password affter the token is issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User changed password", 401));
  }
  req.user = freshUser;
  next();
});

//Check role of user
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You dont have permision to perform this acction", 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user bases on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  // If token is not expired and there is user, set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log the user and send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  console.log(user);
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(200).json({
    status: "success",
    token,
    data: { user: newUser },
    headers: { "Content-Type": "application/json" },
  });
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
  const token = signToken(user._id);
  res.status(200).json({ status: "success", token });
});

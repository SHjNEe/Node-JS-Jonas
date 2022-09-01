const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    // trim: true,
    // maxLenght: [40, "A tour name must have less or qual then 40 characters"],
    // minLength: [10, "A tour name must have more or qual then 10 characters"],
  },
  email: {
    type: String,
    unique: [true, "This email is already taken"],
    required: [true, "Please enter your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter incorrect email type"],
  },
  password: {
    type: String,
    maxLenght: [40, "A password must have less or qual then 40 characters"],
    minLength: [8, "A password must have more or qual then 8 characters"],
    required: [true, "Please enter your password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, "Please enter your confirm password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Not correct password",
    },
  },
  photo: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//HASH PW when LogIn
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

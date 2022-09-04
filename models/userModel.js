const mongoose = require("mongoose");

const crypto = require("crypto");

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
      validator: function(val) {
        return val === this.password;
      },
      message: "Not correct password",
    },
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  photo: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, async function(next) {
  // This point to current query
  this.find({
    active: {
      $ne: false,
    },
  });
  next();
});

//HASH PW when LogIn
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

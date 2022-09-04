const express = require("express");

const userController = require("../controller/userController");
const authController = require("../controller/authController");

const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = authController;
const { getAllUsers, updateMe } = userController;

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.route("/").get(getAllUsers);

module.exports = router;

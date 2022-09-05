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
  restrictTo,
} = authController;
const { getAllUsers, updateMe, deleteMe, getUser } = userController;

const router = express.Router();
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.patch("/deleteMe", protect, deleteMe);
router.route("/").get(protect, restrictTo("admin"), getAllUsers);
router.route("/:id").get(getUser);

module.exports = router;

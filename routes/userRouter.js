const express = require("express");

const userController = require("../controller/userController");
// const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");
const app = require("../app");

const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = authController;
const {
  getAllUsers,
  updateMe,
  deleteMe,
  getMe,
  getUser,
  createUser,
  updateUser,
} = userController;

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

//Protect all router midlewares
router.use(protect);
router.get("/me", getMe, getUser);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateMe);
router.patch("/deleteMe", deleteMe);

//Protect router with role
router.use(restrictTo("admin", "user"));
router.route("/").get(getAllUsers);
router.post("/", createUser);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser);
//NESTED API
module.exports = router;

const express = require("express");
const userController = require("../controllers/userController");
// const reviewController = require("../controller/reviewController");
const authController = require("../controllers/authController");

const {
  signUp,
  logIn,
  logOut,
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
  uploadUserPhoto,
  resizeUserPhoto,
} = userController;

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", logOut);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

//Protect all router midlewares
router.use(protect);
router.get("/me", getMe, getUser);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
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

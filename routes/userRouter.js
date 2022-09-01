const express = require("express");

const userController = require("../controller/userController");
const authController = require("../controller/authController");

const { signUp, logIn } = authController;
const { getAllUsers } = userController;

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.route("/").get(getAllUsers);

module.exports = router;

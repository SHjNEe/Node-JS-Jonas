const express = require("express");

const router = express.Router();
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

const { getAllReviews, createReview } = reviewController;
const { protect, restrictTo } = authController;

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user", "admin"), createReview);

module.exports = router;

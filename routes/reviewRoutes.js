const express = require("express");

const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/reviewController");
const authController = require("../controller/authController");

/*----------------------------------------------------------------
GET v1/api/tour/:tourID/review
POST v1/api/tour/:tourID/review
*/

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;

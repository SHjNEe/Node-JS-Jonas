const express = require("express");

const router = express.Router();
const reviewRouter = require("./reviewRoutes");

const tourController = require("../controllers/tourController");
const reviewController = require("../controllers/reviewController");

//PROTECT ROUTER
const authController = require("../controllers/authController");

const {
  aliasTopTours,
  getAllTours,
  createTours,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = tourController;
router.route("/tour-stats").get(getTourStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
// router.param("id", checkId);
router
  .route("/")
  .get(
    authController.protect,
    // authController.restrictTo("admin", "lead-guide"),
    getAllTours
  )
  .post(createTours);
router
  .route("/:id")
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    deleteTour
  );

/*----------------------------------------------------------------
NESTED router
GET v1/api/tour/:tourID/review
POST v1/api/tour/:tourID/review
*/
// router
//   .route("/:tour/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTo("admin", "user"),
//     reviewController.createReview
//   );
router.use("/:tourID/reviews", reviewRouter);

module.exports = router;

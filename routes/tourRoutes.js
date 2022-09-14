const express = require("express");

const router = express.Router();
const reviewRouter = require("./reviewRoutes");

const tourController = require("../controller/tourController");
const reviewController = require("../controller/reviewController");

//PROTECT ROUTER
const authController = require("../controller/authController");

const {
  aliasTopTours,
  getAllTours,
  createTours,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} = tourController;
router.route("/tour-stats").get(getTourStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
// router.param("id", checkId);
router
  .route("/")
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide", "user"),
    createTours
  );
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    deleteTour
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getDistances);
router.route("/distances/:latlng/unit/:unit").get(getDistances);
// tours-within/distance=223,center=-40,45&unit=mi
// tours-within/223/center/40,45/unit/mi
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
router.use("/:tourId/reviews", reviewRouter);

module.exports = router;

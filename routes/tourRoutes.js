const express = require("express");

const router = express.Router();
const tourController = require("../controller/tourController");

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
} = tourController;
router.route("/tour-stats").get(getTourStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
// router.param("id", checkId);
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    getAllTours
  )
  .post(createTours);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    deleteTour
  );

module.exports = router;

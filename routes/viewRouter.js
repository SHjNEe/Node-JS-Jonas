const express = require("express");
const viewController = require("../controller/viewController");
const { getOverview, getHomePage, getTour } = viewController;

const router = express.Router();
router.get("/", getOverview);
// router.get("/overview", getOverview);
router.get("/tour", getTour);

module.exports = router;

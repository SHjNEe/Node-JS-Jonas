const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // GET tour data from collection
  const tours = await Tour.find();
  // Build templates

  // Render that template

  res.status(200).render("overview", { title: "All Tours", tours });
});

exports.getHomePage = (req, res, next) => {
  res.status(200).render("base", {
    tour: "Tours",
    user: "Jonas",
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  // GET data for  the request
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review  rating user",
  });
  //Build templates

  // Render that template using data
  res.status(200).render("tour", { tour });
});

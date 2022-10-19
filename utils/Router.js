const tourRouter = require("../routes/tourRoutes");
const userRouter = require("../routes/userRoutes");
const reviewRouter = require("../routes/reviewRoutes");
const viewRouter = require("../routes/viewRoutes");
const bookingRouter = require("../routes/bookingRoutes");

function Router(app) {
  //VIEW ROUTE
  app.use("/", viewRouter);
  // API ROUTE
  app.use("/api/v1/tours", tourRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/bookings", bookingRouter);
}

module.exports = Router;

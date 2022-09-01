const express = require("express");

const app = express();
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRouter");
//MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  next();
});
//ROUTE HANDLER

//ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
//404 NOT FOUND
app.all("*", (req, res, next) => {
  //1
  // res.status(404).json({
  //   status: "Can't find",
  //   message: `Cant find ${req.originalUrl} on this server`,
  // });

  //2
  // const err = new Error(`Cant find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
// 404 NEXT
app.use(globalErrorHandler);
module.exports = app;

const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");

const Router = require("./utils/Router");
const globalErrorHandler = require("./controllers/errorController");


//Serving static files
app.use(express.static(path.join(__dirname, "public")));

//SET VIEW ENGINE
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//MIDDLEWARES
//Security HELMET
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// RATE LIMIT REQUEST from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: (60 * 60) ^ 1000,
  message: "Too many request from this IP. please try again in hours",
});
app.use("/api", limiter);

//BODY parser, reading data from body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//Data sanitization against noSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
//Middleware CORS in locall
app.use(cors());

//Test midlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//ROUTE HANDLER
Router(app);

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

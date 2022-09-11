const mongoose = require("mongoose");
const { promises } = require("nodemailer/lib/xoauth2");

const slugify = require("slugify");

const validator = require("validator");
// const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour must have name"],
      unique: true,
      trim: true,
      maxLenght: [40, "A tour name must have less or qual then 40 characters"],
      minLength: [10, "A tour name must have more or qual then 10 characters"],
      // validate: [validator.isAlpha, "Tour name must be character"],
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "A tour must have difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: "Discount price must be less than price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have image cover"],
    },
    image: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: Object,
    },
    secretTour: {
      type: Boolean,
      default: true,
    },
    startLocation: {
      //GEO JSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      typecoordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        typecoordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // Embedding
    // guides: Array,

    // Child Ref
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    // reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// tourSchema.indexes({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});
// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
//DOCUMENT MIDDLEWARES: run before save() and create()
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// EMBEDDING
// tourSchema.pre("save", async function(next) {
//   const guidesPromises = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//QUERY MIDDLEWARES:
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

//AGGREGATE
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

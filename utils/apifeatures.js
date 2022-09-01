class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) FILLTERING
    // 127.0.0.1:3000/api/v1/tours?duration=5&price=1000
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const q = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete q[el]);

    // 2) Advanced FILLTERING
    // 127.0.0.1:3000/api/v1/tours?duration[gte]=5
    let qStr = JSON.stringify(q);
    qStr = qStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(qStr));
    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      // 127.0.0.1:3000/api/v1/tours?sort=-duration, ratingsAverage
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitedFields() {
    // 4) Field limiting
    if (this.queryString.fields) {
      //127.0.0.1:3000/api/v1/tours?fields=name,duration,price,difficulty
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    // 5) Pagination
    //127.0.0.1:3000/api/v1/tours?page=2&limit=50
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;

/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //all methods will manipulate this.query

  filter() {
    //1.Filetering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //exclude special field names
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(this.queryString, queryObj);
    //Advanced filtering

    let queryStrr = JSON.stringify(queryObj);
    queryStrr = queryStrr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    //here since gte/lte and other we are sending from UI, so our requets params will have [gte],[lte]
    //eg {ip}/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
    console.log(JSON.parse(queryStrr));
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals('5')
    //   .where('difficulty')
    //   .equals('easy');
    //bind to query that we already have
    this.query = this.query.find(JSON.parse(queryStrr));
    return this;
  }

  sort() {
    //2.sorting
    ///sending sort as a query param like {}/api/v2/tour?sort=-price,+ratingsAverage
    //for multiple sorting

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
      //adding default sort
    }
    return this;
  }

  limit() {
    //3)limiting fields
    // route example {ip}/api/tours?fields=name,duration,difficulty,price

    if (this.queryString.field) {
      const fields = this.queryString.field.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //excluding the v filed
    }
    return this;
  }

  paginate() {
    ///4) Pagination
    //route [ip]/api/tpurs?page=2&limit=10
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit || 100;
    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;

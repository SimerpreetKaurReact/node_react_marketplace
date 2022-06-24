const Tour = require('../model/tour');

//const tours = fs.readFileSync('./../dev-data/data/tours-simple.json');
// export const checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (val * 1 > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

// export const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: 'Missing price or name' });
//   }
//   next();
// };
exports.aliasTopTours = async (req, res, next) => {
  //prefilling query objects with default values
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';\
  next()
};
exports.getTour = async (req, res) => {
  console.log(req.params);
  //const tour = tours.find((ele) => ele.id === req.params.id * 1);
  const tours = await Tour.findById(req.params.id);
  //const tours = await Tour.findOne({id:req.params.id});

  try {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestTime: req.requestTime,
      data: { tours },
      // results: tours.length,
      // requestTime: req.requestTime,
      // data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      message: err,
    });
  }
  res.status(200).json({
    status: 'success',
    // data: { tour }
  });
};
exports.getAllTours = async (req, res) => {
  try {
    //1.Filetering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //exclude special field names
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);
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
    //2.sorting
    ///sending sort as a query param like {}/api/v2/tour?sort=-price,+ratingsAverage
    //for multiple sorting

    let tours = await Tour.find(JSON.parse(queryStrr));
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join('');
      tours = tours.sort(sortBy);
    } else {
      tours = tours.sort('-createdAt');
      //adding default sort
    }
    //3)limiting fields
    // route example {ip}/api/tours?fields=name,duration,difficulty,price

    if (req.query.field) {
      const fields = req.query.split(',').join('');
      tours = tours.select(fields);
    } else {
      tours = tours.select('-__v'); //excluding the v filed
    }

    ///4) Pagination
    //route [ip]/api/tpurs?page=2&limit=10
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit || 100;
    tours = tours.skip((page - 1) * limit).limit(limit);
    if (req.query.page) {
      const numTOurs = await Tour.countDocuments();
      if ((page - 1) * limit >= numTOurs)
        throw new Error('this page does not exists');
    }
    //4)ALiasing
    const toursList = await tours;

    res.status(200).json({
      status: 'success',
      results: toursList.length,
      requestTime: req.requestTime,
      data: { toursList },
      // results: tours.length,
      // requestTime: req.requ  estTime,
      // data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'success',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res
      .status(201)
      .json({ status: 'success', results: newTour.length, data: { newTour } });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err });
  }

  // const newId = tours[tours.length - 1] + 1;
  // const newTours = Object.assign({ id: newId }, req.body);
  // tours.push(newTours);
  // fs.writeFile(
  //   `${__dirname}/dev_data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res
  //       .status(201)
  //       .json({ status: 'success', results: tours.length, data: { newTours } });
  //   }
  // );
};
exports.updateTours = async (req, res) => {
  try {
    const tour = Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //new for sending back the new updated document
    //runValidators makes sure model validators are verified again
    res.status(200).json({
      status: 'success',
      data: { tour: tour },
    });
  } catch (err) {
    res.status(404).json({ status: 'failed' });
  }
  //const updatedTour = tours.map((ele) => {
  //   if (ele.id === req.params.id * 1) {
  //   }
  //   return ele;
  // });
  res.status(200).json({
    status: 'success',
    // data: { tour: updatedTour }
  });
};
exports.deleteTours = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'failed', message: err });
  }
};

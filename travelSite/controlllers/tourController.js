const multer = require('multer');
const Tour = require('../model/tour');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sharp = require('sharp');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handleFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('file type should be image', 404), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);
//upload.single('image');
//upload.array('images', 5);
//req.file, for single
// req.files for fields, array
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  //1)proccessing the coverimages
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  //2images
  req.body.images = [];
  await Promise.all(
    //since below is an async function it will return a promise,
    // here without promise all we are not waiting for req.files to complete
    //since we are not awaiting that
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );

  //by await this promise, since our async is on Foreach,so after foreach iteration it will go to next
  //by using promise all, we make sure all promises stored after.map are completed before moving on

  next();
});
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
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.getAllTours = getAll(Tour);

// exports.getTour = catchAsync(async (req, res, next) => {
//   console.log(req.params);
//   //const tour = tours.find((ele) => ele.id === req.params.id * 1);
//   const tours = await Tour.findById(req.params.id).populate('reviews');
//   //const tours = await Tour.findOne({id:req.params.id});
//   if (!tours) {
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     requestTime: req.requestTime,
//     data: { tours },
//     // results: tours.length,
//     // requestTime: req.requestTime,
//     // data: { tours },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'success',
//   //     message: err,
//   //   });
//   // }
//   // res.status(200).json({
//   //   status: 'success',
//   //   // data: { tour }
//   // });
// });
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   //1.Filetering
//   //const queryObj = { ...req.query };
//   ///const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   //exclude special field names
//   //excludedFields.forEach((el) => delete queryObj[el]);
//   // console.log(req.query, queryObj);
//   //Advanced filtering

//   //let queryStrr = JSON.stringify(queryObj);
//   // queryStrr = queryStrr.replace(
//   //   /\b(gte|gt|lte|lt)\b/g,
//   //   (match) => `$${match}`
//   // );
//   //here since gte/lte and other we are sending from UI, so our requets params will have [gte],[lte]
//   //eg {ip}/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
//   // const tours = await Tour.find()
//   //   .where('duration')
//   //   .equals('5')
//   //   .where('difficulty')
//   //   .equals('easy');
//   //2.sorting
//   ///sending sort as a query param like {}/api/v2/tour?sort=-price,+ratingsAverage
//   //for multiple sorting

//   // let tours = await Tour.find(JSON.parse(queryStrr));
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join('');
//   //   tours = tours.sort(sortBy);
//   // } else {
//   //   tours = tours.sort('-createdAt');
//   //   //adding default sort
//   // }
//   //3)limiting fields
//   // route example {ip}/api/tours?fields=name,duration,difficulty,price

//   // if (req.query.field) {
//   //   const fields = req.query.split(',').join('');
//   //   tours = tours.select(fields);
//   // } else {
//   //   tours = tours.select('-__v'); //excluding the v filed
//   // }

//   ///4) Pagination
//   //route [ip]/api/tpurs?page=2&limit=10
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit || 100;
//   // tours = tours.skip((page - 1) * limit).limit(limit);
//   // if (req.query.page) {
//   //   const numTOurs = await Tour.countDocuments();
//   //   if ((page - 1) * limit >= numTOurs)
//   //     throw new Error('this page does not exists');
//   // }
//   //4)ALiasing
//   //const toursList = await tours;
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limit()
//     .paginate();

//   const tourList = await features.query;

//   res.status(200).json({
//     status: 'success',
//     results: tourList.length,
//     requestTime: req.requestTime,
//     data: { tourList },
//     // results: tours.length,
//     // requestTime: req.requ  estTime,
//     // data: { tours },
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'success',
//   //     message: err,
//   //   });
//   // }
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res
//     .status(201)
//     .json({ status: 'success', results: newTour.length, data: { newTour } });

//   // const newId = tours[tours.length - 1] + 1;
//   // const newTours = Object.assign({ id: newId }, req.body);
//   // tours.push(newTours);
//   // fs.writeFile(
//   //   `${__dirname}/dev_data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res
//   //       .status(201)
//   //       .json({ status: 'success', results: tours.length, data: { newTours } });
//   //   }
//   // );
// });
exports.createTour = createOne(Tour);

exports.updateTours = updateOne(Tour);
// exports.updateTours = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tourList found with ', 404));
//   }
//   //new for sending back the new updated document
//   //runValidators makes sure model validators are verified again
//   res.status(200).json({
//     status: 'success',
//     data: { tour: tour },
//   });

//   //const updatedTour = tours.map((ele) => {
//   //   if (ele.id === req.params.id * 1) {
//   //   }
//   //   return ele;
//   // });
// });
exports.deleteTours = deleteOne(Tour);

// exports.deleteTours = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tourList found with ', 404));
//   }
//   res.status(204).json({ status: 'success', data: null });
// });

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({ status: 'success', data: stats });
});
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const stats = await Tour.aggregate([
    {
      $unwind: 'startDate',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTour: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTour: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({ status: 'success', data: stats });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

//calculate distances to all the tours from a certain point
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      //geonear always needsa to be first stage in pipeline
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance', //field that will be created where all the calculated distances will be stored
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

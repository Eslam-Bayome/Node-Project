import { NextFunction } from 'express';
import { Review } from '../models/reviewModel';
import { catchAsync } from '../utils/catchAsync';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';

const setTourAndUserIds = (req: any, res: any, next: NextFunction) => {
  if (req?.params?.tourId && !req.body.tour) req.body.tour = req.params.tourId;
  if (req?.user?.id && !req.body.user) req.body.user = req.user.id;
  next();
};
// const createReview = catchAsync(async (req: any, res, next) => {
//   // allowed for nested routes
//   if (req?.params?.tourId && !req.body.tour) req.body.tour = req.params.tourId;
//   if (req?.user?.id && !req.body.user) req.body.user = req.user.id;

//   const rev = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       rev,
//     },
//   });
//   next();
// });

// const getAllReviews = catchAsync(async (req, res, next) => {
//   const filter: any = {};
//   if (req?.params?.tourId) filter.tour = req.params.tourId;
//   if (req?.params?.userId) filter.user = req.params.userId;
//   // const features = new APIFeatures(Review.find(), req.query);

//   // const finalQuery = features.filter().sort().limitFields().paginate();
//   // const reviews = await finalQuery.query;

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

const createReview = createOne(Review);
const getAllReviews = getAll(Review);
const deleteReview = deleteOne(Review);

const updateReview = updateOne(Review);
const getReview = getOne(Review);
export {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  getReview,
};

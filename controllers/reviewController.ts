import { Review } from '../models/reviewModel';
import { APIFeatures } from '../utils/apiFeatures';
import { catchAsync } from '../utils/catchAsync';

const createReview = catchAsync(async (req, res, next) => {
  const rev = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      rev,
    },
  });
  next();
});
const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query);

  const finalQuery = features.filter().sort().limitFields().paginate();
  const reviews = await finalQuery.query;

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export { createReview, getAllReviews };

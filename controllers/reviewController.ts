import { Review } from '../models/reviewModel';
import { APIFeatures } from '../utils/apiFeatures';
import { catchAsync } from '../utils/catchAsync';

const createReview = catchAsync(async (req: any, res, next) => {
  // allowed for nested routes
  if (req?.params?.tourId && !req.body.tour) req.body.tour = req.params.tourId;
  if (req?.user?.id && !req.body.user) req.body.user = req.user.id;

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
  const filter: any = {};
  if (req?.params?.tourId) filter.tour = req.params.tourId;
  if (req?.params?.userId) filter.user = req.params.userId;
  // const features = new APIFeatures(Review.find(), req.query);

  // const finalQuery = features.filter().sort().limitFields().paginate();
  // const reviews = await finalQuery.query;

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export { createReview, getAllReviews };

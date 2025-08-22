import {
  allowedRoles,
  protectedMiddlewareRoute,
} from '../controllers/authController';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourAndUserIds,
  updateReview,
} from '../controllers/reviewController';

const express = require('express');

export const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter.route('/').get(getAllReviews);
reviewRouter.route('/:id').get(getReview);

reviewRouter.use(protectedMiddlewareRoute);

reviewRouter.route('/:id').delete(allowedRoles('user', 'admin'), deleteReview);
reviewRouter.route('/:id').patch(allowedRoles('user', 'admin'), updateReview);
reviewRouter.route('/').post(setTourAndUserIds, createReview);

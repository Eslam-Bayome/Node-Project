import { protectedMiddlewareRoute } from '../controllers/authController';
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
reviewRouter.route('/:id').delete(protectedMiddlewareRoute, deleteReview);
reviewRouter.route('/:id').get(getReview);
reviewRouter.route('/:id').patch(protectedMiddlewareRoute, updateReview);
reviewRouter
  .route('/')
  .post(protectedMiddlewareRoute, setTourAndUserIds, createReview);

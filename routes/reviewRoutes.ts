import { protectedMiddlewareRoute } from '../controllers/authController';
import {
  createReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController';

const express = require('express');

export const reviewRouter = express.Router({
  mergeParams: true,
});

reviewRouter.route('/').get(getAllReviews);
reviewRouter.route('/:id').delete(protectedMiddlewareRoute, deleteReview);
reviewRouter.route('/').post(protectedMiddlewareRoute, createReview);

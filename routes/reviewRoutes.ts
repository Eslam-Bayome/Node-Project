import { protectedMiddlewareRoute } from '../controllers/authController';
import { createReview, getAllReviews } from '../controllers/reviewController';

const express = require('express');

export const reviewRouter = express.Router();

reviewRouter.route('/').get(getAllReviews);
reviewRouter.route('/').post(protectedMiddlewareRoute, createReview);

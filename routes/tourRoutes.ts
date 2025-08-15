import express, { NextFunction, Request, Response } from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  deleteTour,
  getMonthlyPlan,
} from '../controllers/tourController';
import {
  isUserHasAllowedRole,
  protectedMiddlewareRoute,
} from '../controllers/authController';
import { reviewRouter } from './reviewRoutes';

const tourRouter = express.Router();

tourRouter.use(`/:tourId/reviews`, reviewRouter);

tourRouter.route('/tour-stats').get(getTourStats);
tourRouter.route('/monthly-stats').get(getMonthlyPlan);

// ? a param middle ware is a function that is called when a request matches a route parameter and it check if it have a valid id
// tourRouter.param('id', checkId);
tourRouter.route('/top-5').get(aliasTopTours, getAllTours);
tourRouter.get(`/`, protectedMiddlewareRoute, getAllTours);

tourRouter.get(`/:id`, getTour);

tourRouter.post(`/`, createTour);

tourRouter.patch(`/:id`, updateTour);

tourRouter.delete(
  `/:id`,
  protectedMiddlewareRoute, // this middleware will check if the user is logged in
  isUserHasAllowedRole('admin', 'lead-guide'), // this middleware will check if the user has the allowed role
  deleteTour
);

// app.route(baseRoute).get(getAllTours).post(createTour);
// app.route(`${baseRoute}/:id`).get(getTour).patch(updateTour).delete(deleteTour);
//? ==============================================================================================================================================================================================3

export default tourRouter;

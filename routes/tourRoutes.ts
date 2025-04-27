import express, { NextFunction, Request, Response } from 'express';

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
} = require('./../controllers/tourController');

const tourRouter = express.Router();
// ? a param middle ware is a function that is called when a request matches a route parameter and it check if it have a valid id
tourRouter.param('id', checkId);

tourRouter.get(`/`, getAllTours);

tourRouter.get(`/:id`, getTour);

tourRouter.post(`/`, createTour);

tourRouter.patch(`/:id`, updateTour);

tourRouter.delete(`/:id`, deleteTour);

// app.route(baseRoute).get(getAllTours).post(createTour);
// app.route(`${baseRoute}/:id`).get(getTour).patch(updateTour).delete(deleteTour);
//? ==============================================================================================================================================================================================3

export default tourRouter;

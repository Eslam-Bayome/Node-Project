const fs = require('fs');
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8')
);

const checkId = (req: Request, res: Response, next: any, val: string) => {
  const tour = tours.find((el: any) => el.id === val);

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const getAllTours = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    // requestedAt: (req as any).currentTime,
    totalCount: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req: Request, res: Response) => {
  const tour = tours.find((el: any) => el.id === req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const createTour = (req: Request, res: Response) => {
  const newId = uuidv4();
  //create new object with the new id
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err: any) => {
      //201 for created data
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req: Request, res: Response) => {
  const tour = tours.find((el: any) => el.id === req.params.id);

  for (let [key, value] of Object.entries((req.query as any) ?? {})) {
    tour[key] = value;
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const deleteTour = (req: Request, res: Response) => {
  const tourIndex = tours.findIndex((el: any) => el.id === req.params.id);

  tours.splice(tourIndex, 1);
  //204 no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const checkBody = (req: Request, res: Response, next: any) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'name and price are required',
    });
  }
  next();
};
module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};

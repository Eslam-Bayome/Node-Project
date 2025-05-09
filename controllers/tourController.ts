const fs = require('fs');
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from '../models/tourModel';

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8')
// );
const handleError = (err: any, req: Request, res: Response) => {
  res.status(400).json({
    status: 'fail',
    message: err,
  });
};

const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      totalCount: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    handleError(err, req, res);
  }
};

const getTour = async (req: Request, res: Response) => {
  try {
    //id come here from where we define it from route file
    const tour = await Tour.findById(req.params.id);
    // findById = =Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    handleError(err, req, res);
  }
};
const createTour = async (req: Request, res: Response) => {
  // const newTours = new Tour({
  //   name: req.body.name,
  //   price: req.body.price,
  // });
  // newTours.save()

  try {
    const newTours = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTours,
      },
    });
  } catch (err) {
    //400 bad request
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateTour = async (req: Request, res: Response) => {
  try {
    const date = new Date().toISOString();
    req.body.updatedAt = date;
    //new:true is to return the updated data after update  not the previous
    // const tour = await Tour.updateOne({ _id: req.params.id }, req.body, {
    //   new: true,
    // });
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    handleError(err, req, res);
  }
};
const deleteTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    //204 no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    handleError(err, req, res);
  }
};

export { getAllTours, getTour, createTour, updateTour, deleteTour };

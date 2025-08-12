const fs = require('fs');
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from '../models/tourModel';
import { APIFeatures } from '../utils/apiFeatures';

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8')
// );
const handleError = (err: any, req: Request, res: Response) => {
  res.status(400).json({
    status: 'fail',
    message: err,
  });
};

const aliasTopTours = (req: Request, res: Response, next: NextFunction) => {
  (req as any).myQuery = {};
  (req as any).myQuery.limit = '5';
  (req as any).myQuery.sort = '-averageRating,price';
  (req as any).myQuery.fields = 'name,price,averageRating,summary,difficulty';
  next();
};
const getAllTours = async (req: Request, res: Response) => {
  let modifiedQuery = req.query;

  if ((req as any).myQuery) {
    modifiedQuery = {
      ...req.query,
      ...(req as any).myQuery,
    };
  }

  try {
    const features = new APIFeatures(Tour.find(), modifiedQuery);
    let finalQuery = features.filter().sort().limitFields().paginate();

    //Execution query
    const tours = await finalQuery.query;

    //Send Response
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
    const tour = await Tour.findById(req.params.id).populate({
      path: 'guides',
      select: '-__v -lastPasswordChangeAt',
    });
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
      runValidators: true, // if it is false the validato will not rereun and this may lead to unwanted data
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

const getTourStats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: {
            $toUpper: '$difficulty',
          },
          toursNumber: {
            $sum: 1,
          },
          numRatings: {
            $sum: '$ratingsQuantity',
          },
          avgTaring: {
            $avg: '$ratingsAverage',
          },
          avgPrice: {
            $avg: '$price',
          },
          minPrice: {
            $min: '$price',
          },

          maxPrice: {
            $max: '$price',
          },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      // {
      //   $match: {
      //     _id: {
      //       $ne: 'EASY',
      //     },
      //   },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    handleError(err, req, res);
  }
};

const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
    const year = req.query.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      year
        ? {
            $match: {
              startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
            },
          }
        : { $match: {} },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: {
            $sum: 1,
          },
          tours: {
            $push: '$name',
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    handleError(err, req, res);
  }
};

export {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};

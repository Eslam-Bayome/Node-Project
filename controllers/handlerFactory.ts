import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { APIFeatures } from '../utils/apiFeatures';
import { AppError } from '../utils/appError';

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that ID', 404));

    //204 no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next) => {
    const date = new Date().toISOString();
    req.body.updatedAt = date;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // if it is false the validato will not rereun and this may lead to unwanted data
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model: any, populateOptions?: Array<any>) =>
  catchAsync(async (req: Request, res: Response, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions?.length)
      query = populateOptions.reduce((acc, curr) => acc.populate(curr), query);

    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response) => {
    let modifiedQuery = req.query;
    const filter: any = {};

    if ((req as any).myQuery) {
      modifiedQuery = {
        ...req.query,
        ...(req as any).myQuery,
      };
    }
    if (req?.params?.tourId) filter.tour = req.params.tourId;

    const features = new APIFeatures(Model.find(filter), modifiedQuery)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID',
      });
    }
    //204 no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

import { Request, Response, NextFunction } from 'express';

interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

interface CatchAsync {
  (fn: AsyncRequestHandler): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}

export const catchAsync: CatchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

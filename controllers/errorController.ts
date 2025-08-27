const mutatedError = (err: any, massage: string) => {
  err.message = massage;
  err.statusCode = 400;
  err.isOperational = true;
};

const handleCastErrorDB = (err: any) => {
  const message = `Invalid value:${err.value} for the field: ${err.path}`;
  mutatedError(err, message);
};
const handleDuplicateFieldsDB = (err: any) => {
  const massage = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  mutatedError(err, massage);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(', ')}`;
  mutatedError(err, message);
};
module.exports = (err: any, req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      err: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.name === 'CastError') handleCastErrorDB(err);
    if (err.code === 11000) handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') handleValidationErrorDB(err);

    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.isOperational ? err.message : 'Something went wrong',
    });
  }
};

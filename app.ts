import pino from 'pino-http';
import express from 'express';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';
import { limiter } from './utils/rateLimiter';
import helmet from 'helmet';
import { reviewRouter } from './routes/reviewRoutes';
import { AppError } from './utils/appError';
const expressMongoSanitize = require('@exortek/express-mongo-sanitize');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
// ?========================================================================================================================================================================
// security HTTP HEADERS in middleware
app.use(helmet());

// optional logger middleware on development
if (process.env.NODE_ENV === 'development') {
  app.use(pino());
}
// ?========================================================================================================================================================================
// we have to use middleware so the body data become awailable in the req object
// body parser , reading data from body into req.body
app.use(
  express.json({
    limit: '20kb',
  })
);
//will be applied for every request if it is added before the route becouse it is a pipeline each one come first! and each route handler is a middleware for the specific route

// test , middleware
app.use((req, res, next) => {
  //if u forget to add next the resposne will be blocked
  next();
});
// data santizing against NoSQL query injection it filter all the dollar signes and the dots in the query body or params or searchParams
app.use(expressMongoSanitize());
// this provide html  syntax for security
//xss

// prevent paramater poolution
//hpp
//static file serving with middleware
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  (req as any).currentTime = new Date().toISOString();

  next();
});

// ?========================================================================================================================================================================
app.use(
  '/api/v1',
  limiter(1, 100, 'Too many requests from this IP, please try again in an hour')
);

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

//middlweare that only be reached if the route is not found
app.use((req, res, next) => {
  // const err: any = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // when ever we path anything to the next function it will know it is an error adn wioll escape all other middlewares
});

app.use(globalErrorHandler);
// ?========================================================================================================================================================================
module.exports = app;

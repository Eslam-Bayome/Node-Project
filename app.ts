import pino from 'pino-http';
import express from 'express';
import userRouter from './routes/userRoutes';
import tourRouter from './routes/tourRoutes';

const app = express();

// ?========================================================================================================================================================================
// we have to use middleware so the body data become awailable in the req object
app.use(express.json());
//will be applied for every request if it is added before the route becouse it is a pipeline each one come first! and each route handler is a middleware for the specific route
app.use((req, res, next) => {
  //if u forget to add next the resposne will be blocked
  next();
});

app.use(pino());

app.use((req, res, next) => {
  (req as any).currentTime = new Date().toISOString();
  next();
});
// ?========================================================================================================================================================================

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

// ?========================================================================================================================================================================
module.exports = app;

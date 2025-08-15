import express from 'express';
import {
  forgetPassword,
  login,
  protectedMiddlewareRoute,
  resetPassword,
  signup,
  updatePassword,
} from '../controllers/authController';
import { limiter } from '../utils/rateLimiter';
import { reviewRouter } from './reviewRoutes';
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('./../controllers/userController');

// this process called mounting a router , so mounting new router on a route

const userRouter = express.Router();

userRouter.use('users/:userId/reviews', reviewRouter);

userRouter.post('/signup', limiter(1, 3), signup);
userRouter.post('/login', limiter(1, 3), login);
userRouter.post('/forget-password', limiter(1, 3), forgetPassword);
userRouter.patch('/reset-password/:token', limiter(1, 3), resetPassword);
userRouter.patch(
  '/update-password',
  limiter(1, 3),
  protectedMiddlewareRoute,
  updatePassword
);
userRouter.patch(
  '/update-me',
  limiter(1, 3),
  protectedMiddlewareRoute,
  updateMe
);
userRouter.delete(
  '/delete-me',
  limiter(1, 3),
  protectedMiddlewareRoute,
  deleteMe
);

//? ==============================================================================================================================================================================================3
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;

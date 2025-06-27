import express from 'express';
import { login, signup } from '../controllers/authController';
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');

// this process called mounting a router , so mounting new router on a route

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);

//? ==============================================================================================================================================================================================3
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;

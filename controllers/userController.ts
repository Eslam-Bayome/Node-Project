import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { deleteOne, getOne, updateOne } from './handlerFactory';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find({
    active: {
      $ne: false,
    },
  });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const updateMe = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    if (
      Object.keys(req.body).find((key) =>
        key.toLowerCase().includes('password')
      )
    ) {
      return res.status(400).json({
        status: 'fail',
        message:
          'This route is not for password updates. Please use /update-password.',
      });
    }

    // we should handle the allowed properies better than that
    delete req.body.role;
    delete req.body.email;
    delete req.body._id;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true, // to return the new data after update not the old one
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  }
);
const getMe = (req: any, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};
const deleteMe = catchAsync(async (req: any, res: Response) => {
  const deletedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      active: false,
    },
    {
      new: true, // to return the new data after update not the old one
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = deleteOne(User);
const updateUser = updateOne(User);
const getUser = getOne(User);

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
};

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<db_username>:<db_password>@natoursv1.cj4lvsk.mongodb.net/?retryWrites=true&w=majority&appName=NatoursV1";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

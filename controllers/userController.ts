import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
const getUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const updateUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const deleteUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };

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

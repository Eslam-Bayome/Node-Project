import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
const jwt = require('jsonwebtoken');

const signToken = (id: any, email: string, photo: string) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      photo: photo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const signup = catchAsync(async (req: any, res: any) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    // role: req.body.role || 'user',
  });
  // first argument is the payload, second is the secret key .. // third is the options like expiration time of the jwt token
  const token = signToken(newUser._id, newUser.email, newUser.photo);
  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req: any, res: any, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and password!',
    });
  }

  const user = await User.findOne({
    email: email,
  }).select('+password'); // this will return the password field as well, since we set select: false in the user model

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password!',
    });
  }

  const isPasswordCorrect = await user.correctPassword({
    candidatePassword: password,
    userPassword: user.password,
  });

  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password!',
    });
  }

  const token = signToken(user._id, user.email, user.photo);

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

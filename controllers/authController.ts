import { promisify } from 'util';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { sendEmail } from '../utils/nodeMailer';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

const createSendToken = (user: any, statusCode: number, res: any) => {
  const token = signToken(user._id, user.email, user.photo);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_EXPIRES_IN ?? '7d') * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  user.passwordConfirm = undefined;
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user,
    },
  });
};

export const signup = catchAsync(async (req: any, res: any) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    role: 'user',
  });

  createSendToken(newUser, 201, res);
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
  }).select('+password +active'); // this will return the password field as well, since we set select: false in the user model

  if (!user || !user.active) {
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

  createSendToken(user, 200, res);
});

export const protectedMiddlewareRoute = catchAsync(
  async (req: any, res: any, next: any) => {
    // 1) Getting token and check if it exists
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!',
      });
    }

    token = token.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!',
      });
    }

    // 2) Validate the token
    const isValidToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // 3) Check if user still exists
    const user = await User.findById(isValidToken.id);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if user changed password after the token was extracted
    let isPasswordChanged = false;
    if (typeof user.isPasswordChanged === 'function') {
      isPasswordChanged = user.isPasswordChanged(isValidToken.iat);
    }

    if (isPasswordChanged) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.',
      });
    }

    // 5) Grant access to protected route
    req.user = user; // attach the user to the request object
    next();
  }
);

export const isUserHasAllowedRole = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action!',
      });
    }

    next();
  };
};

export const forgetPassword = catchAsync(
  async (req: any, res: any, next: any) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with this email address.',
      });
    }
    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken?.();
    await user.save({ validateBeforeSave: false }); // Save the user with the reset token and expiration time

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 5 min)',
        message: `Here is your password reset : ${resetURL}. If you didn't request this, please ignore this email.`,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.createPasswordResetToken = undefined; // Clear the reset token
      user.passwordResetExpires = undefined; // Clear the expiration time
      await user.save({ validateBeforeSave: false }); // Save the user without the reset token and expiration time

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!',
      });
    }
  }
);
export const resetPassword = async (req: any, res: any, next: any) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: 'fail',
      message: 'Token is invalid or has expired.',
    });
  }
  //2) if token not expired and there is a user we set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined; // Clear the expiration time
  user.passwordResetToken = undefined; // Clear the reset token
  //3) update the changedPasswordAt prop for user
  // user.lastPasswordChangeAt = new Date(); // Update the last password change time
  await user.save(); // Save the user with the new password

  //4) log the user in and send jwt optional!
  createSendToken(user, 200, res);
};

export const updatePassword = catchAsync(
  async (req: any, res: any, next: any) => {
    //1) get user from collection
    const user = await User.findById(req.user.id).select('+password');
    //2) check if posted current password is correct
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in!',
      });
    }
    const isPasswordCorrect = await user.correctPassword({
      candidatePassword: req.body.currentPassword,
      userPassword: user.password,
    });

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong.',
      });
    }

    //3) if so update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    user.save();
    // we do user.save() not all in one as findByIdAndUpdate, because it will not trigger the pre save middleeware aand also the validate of the passwordConfirm field

    //4) log the user in and send jwt optional!
    createSendToken(user, 200, res);
  }
);

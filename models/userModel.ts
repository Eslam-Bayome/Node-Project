import mongoose, { Document } from 'mongoose';
const bcrypt = require('bcrypt');

// Simple interface - just extend Document directly
interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  lastPasswordChangeAt?: Date;
  correctPassword(params: {
    candidatePassword: string;
    userPassword: string;
  }): Promise<boolean>;
  isPasswordChanged?: (JWTTimestamp: number) => boolean;
}

// Simple schema - no complex generics
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // Use function instead of arrow function for proper 'this' binding
      validator: function (el: string) {
        return el === (this as any).password;
      },
      message: 'Passwords are not the same!',
    },
  },
  lastPasswordChangeAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = ''; // Clear passwordConfirm after hashing
  next();
});
// Add the method
userSchema.methods.correctPassword = async function ({
  candidatePassword,
  userPassword,
}: {
  candidatePassword: string;
  userPassword: string;
}): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChanged = function (JWTTimestamp: number) {
  if (!this.lastPasswordChangeAt) return false;
  const changedTimeStamp = this.lastPasswordChangeAt.getTime() / 1000;
  return JWTTimestamp < changedTimeStamp;
};

// Simple model creation
export const User = mongoose.model<IUser>('User', userSchema);

import mongoose, { Document } from 'mongoose';
const bcrypt = require('bcrypt');

// Simple interface - just extend Document directly
interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  correctPassword(params: {
    candidatePassword: string;
    userPassword: string;
  }): Promise<boolean>;
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

// Simple model creation
export const User = mongoose.model<IUser>('User', userSchema);

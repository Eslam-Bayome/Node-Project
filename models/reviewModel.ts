import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      required: [true, "Review can't be empty"],
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating can't be empty"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
reviewSchema.pre(/^find/, function (next) {
  (this as any).populate({
    path: 'user',
    select: 'name photo',
  });
  // .populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  next();
});
export const Review = mongoose.model('Review', reviewSchema);

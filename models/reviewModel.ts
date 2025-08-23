import mongoose from 'mongoose';
import { Tour } from './tourModel';

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
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  // we make it static method so we can call the aggregate method in the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating.toFixed(2),
  });
};

reviewSchema.post('save', function () {
  (this.constructor as any).calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  const document = await (this as any).clone().findOne();
  (this as any).reviewDoc = document;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //  const document = await (this as any).clone().findOne();  does not work here becoasue the query has already executed
  if ((this as any).reviewDoc) {
    await ((this as any).reviewDoc.constructor as any).calcAvgRatings(
      (this as any).reviewDoc.tour
    );
  }
});

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

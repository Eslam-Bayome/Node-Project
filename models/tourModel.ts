import mongoose from 'mongoose';
import slugify from 'slugify';
// import { User } from './userModel';

// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [30, 'A tour name must have less or equal than 30 characters'],
      minLength: [5, 'A tour name must have more or equal than 5 characters'],
      immutable: true, // this will make the name immutable, it can't be changed after creation
      // validate: {
      //   validator: function (val) {
      //     // Only check alphabetic characters and ignore spaces
      //     return validator.isAlpha(val.replaceAll(' ', ''));
      //   },
      //   message: 'A tour name must only contain alphabetic characters',
      // },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], //min and max can work with numbers and dates
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val: number) {
          return val < (this as any).price; // this will not work on update
        },
        message: 'Discount price {VALUE} should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // removes white spaces in the beginning and end
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, // it will be the name of the image that we will read from out file system !, because we dont want to store the image in the database
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: String,
      default: 'Anonymous',
    },
    slug: {
      type: String,
      unique: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON , thats the format of the location data
      typs: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // embedded documents with array of objects GeoJSON
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// document middleware : runs before .save() and .create() but not .insertMany()

tourSchema.pre('save', function (next) {
  //here we have  the data that come from request :) we can mutate it , for example we can create a slug
  this.slug = slugify(this.name, { lower: true });

  next();
});
// we dont empbeding data from other documents we will use referencing instead
// tourSchema.pre('save', async function (next) {
//   const guides = this.guides.map(async (id: string) => await User.findById(id));
//   this.guides = await Promise.all(guides);
//   next();
// });

// it execute after all the pre middleware executed and we dont have this keyword we just have the doc  after it saved in db
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

//Query Middleware

tourSchema.pre(/^find/, function (next) {
  // the different is the this keyword will point to the current query not the current document
  (this as any).find({ secretTour: { $ne: true } });
  (this as any).start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - (this as any).start} milliseconds!`);
  next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  // we have access to the pipeline in the this keyword as a function
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
export const Tour = mongoose.model('Tour', tourSchema);

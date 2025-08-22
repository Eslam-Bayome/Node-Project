const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const { Tour } = require('../../models/tourModel.ts');
const { Review } = require('../../models/reviewModel.ts');
const { User } = require('../../models/userModel.ts');

//we have to import dotenv before importing the app
dotenv.config({ path: './config.env' });

const DB = process?.env?.MONGO_URI?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

mongoose.connect(DB || '').then((conc) => {});

//Read file
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');
const importData = async () => {
  try {
    const data = JSON.parse(tours);
    const user = JSON.parse(users);
    const review = JSON.parse(reviews);
    await Tour.create(data, {
      validateBeforeSave: false,
    });
    await User.create(user, {
      validateBeforeSave: false,
    });
    await Review.create(review, {
      validateBeforeSave: false,
    });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

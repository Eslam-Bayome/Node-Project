const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Tour } = require('./../../models/tourModel');

//we have to import dotenv before importing the app
dotenv.config({ path: './config.env' });

const DB = process?.env?.MONGO_URI?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

mongoose.connect(DB || '').then((conc: any) => {});

//Read file
const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');
const importData = async () => {
  try {
    const data = JSON.parse(tours);
    await Tour.create(data);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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

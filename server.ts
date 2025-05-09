import mongoose from 'mongoose';
import dotenv from 'dotenv';
//we have to import dotenv before importing the app
dotenv.config({ path: './config.env' });

const DB = process?.env?.MONGO_URI?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

mongoose.connect(DB || '').then((conc: any) => {});

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

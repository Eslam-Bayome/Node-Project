import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  //we give the server a chance to finish the request adn after the server killed
  server.close(() => {
    process.exit(1);
  });
});

//we have to import dotenv before importing the app
dotenv.config({ path: './config.env' });

const DB = process?.env?.MONGO_URI?.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

mongoose.connect(DB || '').then((conc: any) => {});

const app = require('./app');

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
// it allow use to catch unhandled errors of async code
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  //we give the server a chance to finish the request adn after the server killed
  server.close(() => {
    process.exit(1);
  });
});

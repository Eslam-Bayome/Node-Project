const dotenv = require('dotenv');
//we have to import dotenv before importing the app
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

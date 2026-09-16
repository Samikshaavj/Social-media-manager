const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const users = await User.find({});
    console.log('Users in DB:', users);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

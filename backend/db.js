const mongoose = require('mongoose');

const db = () => {
  mongoose.connect('mongodb://localhost:27017/paytm')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = db;

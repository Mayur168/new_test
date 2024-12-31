// y0nX3w3v3X2Bt5eH
const mongoose = require('mongoose');

const uri = 'mongodb+srv://mayurgaikwad20679:y0nX3w3v3X2Bt5eH@cluster0.spqsm.mongodb.net/auth-db?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

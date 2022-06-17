const mongoose = require('mongoose');

const { MONGODB_URI = 'mongodb+srv://rbn10003:Nolose159357@paul.rgsvr.mongodb.net/mydatabase?retryWrites=true&w=majority' } = process.env

const db = {
  connect: () => {
    return mongoose.connect(MONGODB_URI).then(() => {
      console.log('MongoDB Running in', MONGODB_URI);
    })
  }
}

module.exports = db
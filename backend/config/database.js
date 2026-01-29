const mongoose = require('mongoose');
const config = require('./environment');

const connectWithRetry = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  mongoose
    .connect(config.mongoUri, options)
    .then(() => {
      console.log('✅ Connected to MongoDB successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
    })
    .catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = { connectWithRetry };

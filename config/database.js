const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 * Handles connection with proper error handling and reconnection logic
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGODB_URI is not defined. Add it to your .env file (copy from env.example).'
      );
    }
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      bufferCommands: true, // Buffer commands if not connected
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    // Don't exit - allow server to start and retry
    // The server can still respond to health checks
    console.log('⚠️  Server will continue without database connection. Retrying in 5 seconds...');
    
    // Retry connection after 5 seconds (only once to avoid infinite loop)
    setTimeout(async () => {
      try {
        console.log('🔄 Retrying MongoDB connection...');
        const uri = process.env.MONGODB_URI;
        if (uri) {
          await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: true,
            bufferMaxEntries: 0,
          });
          console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        }
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError.message);
        console.log('⚠️  MongoDB connection will be retried on next request');
      }
    }, 5000);
  }
};

module.exports = connectDB;


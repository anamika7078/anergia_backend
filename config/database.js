const mongoose = require('mongoose');

let retryCount = 0;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 5000; // 5 seconds

/**
 * Connect to MongoDB Atlas
 * Handles connection with proper error handling and exponential backoff retry logic
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGODB_URI is not defined. Add it to your .env file (copy from env.example).'
      );
    }

    // Configure mongoose to handle connection better
    mongoose.set('bufferCommands', false); // Disable buffering - fail fast if not connected
    mongoose.set('bufferMaxEntries', 0); // Disable buffering
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      retryWrites: true,
      w: 'majority',
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset retry count on successful connection

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
      // Attempt to reconnect
      setTimeout(() => {
        if (mongoose.connection.readyState === 0) {
          connectDB().catch((err) => {
            console.error('❌ Reconnection attempt failed:', err.message);
          });
        }
      }, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      retryCount = 0;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    retryCount++;
    console.error(`❌ Error connecting to MongoDB (attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
    
    // Don't exit - allow server to start and retry
    // The server can still respond to health checks
    if (retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1); // Exponential backoff
      console.log(`⚠️  Retrying MongoDB connection in ${delay / 1000} seconds...`);
      
      setTimeout(async () => {
        try {
          await connectDB();
        } catch (retryError) {
          // Error already logged in recursive call
        }
      }, delay);
    } else {
      console.error('❌ Max retry attempts reached. MongoDB connection failed.');
      console.log('⚠️  Server will continue without database connection.');
      console.log('⚠️  Please check:');
      console.log('   1. MONGODB_URI is correct in environment variables');
      console.log('   2. MongoDB Atlas IP whitelist includes Render IPs (0.0.0.0/0)');
      console.log('   3. MongoDB cluster is not paused');
      console.log('   4. Database user credentials are correct');
    }
  }
};

/**
 * Check if MongoDB is connected
 * @returns {boolean} True if connected, false otherwise
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

/**
 * Wait for MongoDB connection (with timeout)
 * @param {number} timeoutMs - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} True if connected, false if timeout
 */
const waitForConnection = async (timeoutMs = 10000) => {
  if (isConnected()) {
    return true;
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isConnected()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

module.exports = connectDB;
module.exports.isConnected = isConnected;
module.exports.waitForConnection = waitForConnection;


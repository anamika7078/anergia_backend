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
    // Allow buffering during initial connection attempts
    // This allows operations to wait for connection instead of failing immediately
    mongoose.set('bufferCommands', true);
    
    const conn = await mongoose.connect(uri, {
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
      console.log('   1. MONGODB_URI is correct in your .env');
      console.log('   2. MongoDB Atlas IP whitelist: add your current IP (or 0.0.0.0/0 for anywhere)');
      console.log('      → https://www.mongodb.com/docs/atlas/security-whitelist/');
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
 * Attempts to connect if not already connecting
 * @param {number} timeoutMs - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} True if connected, false if timeout
 */
const waitForConnection = async (timeoutMs = 15000) => {
  if (isConnected()) {
    return true;
  }

  const readyState = mongoose.connection.readyState;
  
  // If disconnected (0) or disconnecting (3), try to initiate connection
  // Only if not already connecting (state 2)
  if ((readyState === 0 || readyState === 3) && readyState !== 2) {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      // Only attempt connection if we have a URI
      console.log('⚠️  Database disconnected. Attempting to reconnect...');
      try {
        // Attempt connection without waiting (fire and forget)
        // Mongoose handles multiple connection attempts safely
        connectDB().catch((err) => {
          console.error('❌ Connection attempt failed:', err.message);
        });
      } catch (err) {
        console.error('❌ Failed to initiate connection:', err.message);
      }
    }
  }

  return new Promise((resolve) => {
    const startTime = Date.now();
    let checkInterval;
    
    // Listen for connection event
    const onConnected = () => {
      cleanup();
      resolve(true);
    };
    
    // Listen for error event
    const onError = (err) => {
      // Log error but don't resolve - let timeout handle it
      console.error('❌ Connection error while waiting:', err.message);
    };
    
    // Cleanup function
    const cleanup = () => {
      if (checkInterval) clearInterval(checkInterval);
      mongoose.connection.removeListener('connected', onConnected);
      mongoose.connection.removeListener('error', onError);
    };
    
    // Set timeout
    const timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);
    
    // Check if already connected
    if (isConnected()) {
      cleanup();
      clearTimeout(timeout);
      resolve(true);
      return;
    }
    
    // Listen for connection events
    mongoose.connection.once('connected', onConnected);
    mongoose.connection.once('error', onError);
    
    // Also poll in case events are missed
    checkInterval = setInterval(() => {
      if (isConnected()) {
        cleanup();
        clearTimeout(timeout);
        resolve(true);
      } else if (Date.now() - startTime > timeoutMs) {
        cleanup();
        clearTimeout(timeout);
        resolve(false);
      }
    }, 200);
  });
};

module.exports = connectDB;
module.exports.isConnected = isConnected;
module.exports.waitForConnection = waitForConnection;


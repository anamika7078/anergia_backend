# Render Deployment Troubleshooting Guide

## Current Issues

### 1. 502 Bad Gateway Error
**Symptom**: `502 (Bad Gateway)` when accessing API endpoints

**Possible Causes**:
- Server crashed during startup
- MongoDB connection failed and server exited
- Environment variables missing
- Build/start command incorrect

### 2. MongoDB Connection Timeout
**Symptom**: `Operation buffering timed out after 10000ms`

**Possible Causes**:
- MongoDB URI incorrect or missing
- MongoDB Atlas IP whitelist doesn't include Render IPs
- Network connectivity issues
- MongoDB cluster is paused or unavailable

## Step-by-Step Fix

### Step 1: Check Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **"Logs"** tab
4. Look for error messages

**Common errors to look for**:
- `MONGODB_URI is not defined`
- `Error connecting to MongoDB`
- `Server running in production mode`
- Any crash/exit messages

### Step 2: Verify Environment Variables

In Render dashboard → Your service → Environment, verify these are set:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-min-32-characters
FRONTEND_URL=https://anergiafrontend.vercel.app
NODE_ENV=production
PORT=10000
```

**Important**: 
- `MONGODB_URI` must be your actual MongoDB Atlas connection string
- No spaces or quotes around values
- Check for typos

### Step 3: Check MongoDB Atlas Configuration

1. **IP Whitelist**:
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs) OR
   - Add Render's IP ranges (check Render docs for current IPs)

2. **Database User**:
   - Verify database user exists
   - Check password is correct
   - Ensure user has read/write permissions

3. **Cluster Status**:
   - Make sure cluster is not paused
   - Free tier clusters pause after inactivity

### Step 4: Verify Build Settings

In Render dashboard → Your service → Settings:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `Backend` (if backend is in subdirectory)

### Step 5: Test MongoDB Connection

**Option 1: Test from Render Shell**
1. Go to Render dashboard → Your service
2. Click **"Shell"** tab
3. Run:
```bash
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

**Option 2: Test Locally**
1. Copy your `.env` file with Render's environment variables
2. Run: `node -e "require('./config/database')()"`

### Step 6: Manual Restart

1. Go to Render dashboard → Your service
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Monitor logs during deployment

## Quick Fixes

### Fix 1: Server Crashes on MongoDB Connection

The server now handles MongoDB connection failures gracefully and won't crash. The updated code:
- Allows server to start even if MongoDB is unavailable
- Retries connection automatically
- Buffers operations until connection is established

### Fix 2: Increase MongoDB Timeout

Updated `database.js` with:
- `serverSelectionTimeoutMS: 30000` (30 seconds)
- `socketTimeoutMS: 45000` (45 seconds)
- Better error handling

### Fix 3: Verify Service is Running

Check Render dashboard:
- Service status should be **"Live"** (green)
- If **"Build failed"** or **"Deploy failed"**, check logs
- If **"Sleeping"**, wake it up or upgrade plan

## Testing After Fix

### 1. Health Check
```bash
curl https://anergia-backend.onrender.com/health
```
Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

### 2. Test API Endpoint
```bash
curl https://anergia-backend.onrender.com/api/settings
```
Should return website settings or empty object.

### 3. Test CORS
```bash
curl -X OPTIONS https://anergia-backend.onrender.com/api/admin/login \
  -H "Origin: https://anergiafrontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```
Should include `Access-Control-Allow-Origin` header.

## Common Render Issues

### Issue: Service Keeps Crashing

**Check**:
1. Logs for error messages
2. Environment variables are set
3. Build command is correct
4. Dependencies in `package.json`

**Solution**:
- Fix the error shown in logs
- Clear build cache and redeploy
- Check Node.js version compatibility

### Issue: Service is Sleeping (Free Tier)

**Symptom**: First request takes 30+ seconds

**Solution**:
- Upgrade to paid plan for always-on
- Use a service like UptimeRobot to ping every 5 minutes
- Accept the cold start delay

### Issue: Build Fails

**Check**:
1. Build logs for specific error
2. `package.json` has all dependencies
3. Node.js version is compatible
4. Build command is correct

**Solution**:
- Fix the specific error
- Try clearing build cache
- Check if all files are committed to Git

## Emergency Fallback

If backend is completely down:

1. **Check Render Status**: [status.render.com](https://status.render.com)
2. **Restart Service**: Render dashboard → Manual Deploy
3. **Check MongoDB Atlas**: Ensure cluster is running
4. **Verify Environment Variables**: All required vars are set
5. **Check Logs**: Look for specific error messages

## Getting Help

1. **Render Support**: [render.com/support](https://render.com/support)
2. **Render Docs**: [render.com/docs](https://render.com/docs)
3. **MongoDB Atlas Support**: [support.mongodb.com](https://support.mongodb.com)

## Prevention

1. **Monitor Logs**: Check regularly for warnings
2. **Set Up Alerts**: Configure email alerts in Render
3. **Health Checks**: Use `/health` endpoint for monitoring
4. **Database Backups**: Regular MongoDB Atlas backups
5. **Environment Variables**: Document all required variables


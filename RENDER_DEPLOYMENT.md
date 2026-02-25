# Render Deployment Guide

This guide explains how to deploy the Anergia backend to Render.

## Prerequisites

- GitHub repository with backend code
- MongoDB Atlas account (or other MongoDB instance)
- Render account (sign up at [render.com](https://render.com))

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your backend code is pushed to GitHub with:
- ✅ `package.json` with all dependencies
- ✅ `server.js` as the entry point
- ✅ `.env.example` with all required variables
- ✅ All necessary files in the `Backend` directory

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Click **"Connect"**

### 3. Configure Service Settings

Fill in the following details:

**Basic Settings:**
- **Name**: `anergia-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `Backend` (if backend is in a subdirectory)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings (Optional):**
- **Auto-Deploy**: `Yes` (deploys automatically on git push)
- **Health Check Path**: `/health`

### 4. Set Environment Variables

In the **Environment** section, add the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# CORS
FRONTEND_URL=https://anergiafrontend.vercel.app

# Environment
NODE_ENV=production

# Port (Render sets this automatically, but you can specify)
PORT=10000
```

**Important Notes:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- Set `FRONTEND_URL` to your Vercel frontend URL
- Never commit `.env` file to Git

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building your service
3. Monitor the build logs for any errors
4. Once deployed, your service will be available at:
   `https://anergia-backend.onrender.com`

### 6. Seed Initial Data (Optional)

After first deployment, you can seed the database:

**Option 1: Using Render Shell**
1. Go to your service in Render dashboard
2. Click **"Shell"** tab
3. Run: `npm run seed`

**Option 2: Using Local Machine**
1. Set up `.env` with Render's environment variables
2. Run: `npm run seed`

### 7. Verify Deployment

Test your API endpoints:

```bash
# Health check
curl https://anergia-backend.onrender.com/health

# Get settings
curl https://anergia-backend.onrender.com/api/settings

# Get services
curl https://anergia-backend.onrender.com/api/services
```

## Post-Deployment Checklist

- [ ] Service is in "Live" status
- [ ] Health check endpoint returns 200
- [ ] API endpoints are accessible
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Database is connected
- [ ] Initial data is seeded (if needed)

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure Node.js version is compatible

**Issue**: Module not found
- Check if all dependencies are in `package.json`
- Verify `node_modules` is not committed to Git
- Try clearing build cache in Render

### Service Won't Start

**Issue**: Application crashes on start
- Check logs for error messages
- Verify environment variables are set
- Ensure MongoDB connection string is correct
- Check if PORT is correctly configured

**Issue**: Database connection fails
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Check MongoDB connection string format
- Verify database user has correct permissions
- Test connection string locally first

### CORS Errors

**Issue**: Frontend can't access API
- Verify `FRONTEND_URL` is set to your Vercel URL
- Check CORS configuration in `server.js`
- Ensure frontend URL matches exactly (including https)
- Check browser console for specific CORS error

### Performance Issues

**Issue**: Slow response times
- Render free tier may have cold starts
- Consider upgrading to paid plan for better performance
- Optimize database queries
- Use connection pooling for MongoDB

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |

## Render Free Tier Limitations

- **Sleep after inactivity**: Free services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep may be slow (30+ seconds)
- **Build time**: Limited build minutes per month
- **Bandwidth**: Limited bandwidth

**Solutions:**
- Use Render's paid plan for always-on services
- Set up a cron job to ping your service periodically
- Use a service like UptimeRobot to keep service awake

## Updating Your Service

Render automatically deploys when you push to your connected branch:

1. Make changes to your code
2. Commit and push to GitHub
3. Render detects the push
4. Builds and deploys automatically
5. Service updates with zero downtime

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and response times
- **Alerts**: Set up email alerts for service issues

## Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Support**: [render.com/support](https://render.com/support)
- **Community**: [community.render.com](https://community.render.com)


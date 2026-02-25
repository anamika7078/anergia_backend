# Quick Setup Guide

## Step 1: Install Dependencies
```bash
cd Backend
npm install
```

## Step 2: Configure Environment Variables
1. Copy `env.example` to `.env`
2. Update the following:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A strong random string (use: `openssl rand -base64 32`)
   - `FRONTEND_URL` - Your Next.js frontend URL (default: http://localhost:3000)

## Step 3: Initialize Admin User
```bash
npm run init-admin
```
This creates the default admin user. **Change the password after first login!**

## Step 4: Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Step 5: Test the API
- Health check: `GET http://localhost:5000/health`
- Get settings: `GET http://localhost:5000/api/settings`

## Admin Login
After initialization, login at:
```
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@anergia.com",
  "password": "admin123"
}
```

You'll receive a JWT token. Use it in the Authorization header for admin routes:
```
Authorization: Bearer <your-token>
```

## Next Steps
1. Update website settings via admin API
2. Create services, products, and blogs
3. Connect your Next.js frontend to these APIs
4. Replace all dummy data in frontend with API calls

## API Base URL
- Development: `http://localhost:5000/api`
- Production: Update `FRONTEND_URL` in `.env` for CORS


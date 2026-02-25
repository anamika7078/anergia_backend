# CORS Fix Guide

## Problem
CORS errors when accessing the backend API from the Vercel frontend:
```
Access to fetch at 'https://anergia-backend.onrender.com/api/admin/login' 
from origin 'https://anergiafrontend.vercel.app' has been blocked by CORS policy
```

## Solution Applied

### 1. CORS Configuration Updates
- **Moved CORS before Helmet**: CORS middleware must be applied before security headers
- **Configured Helmet**: Set `crossOriginResourcePolicy` to allow cross-origin requests
- **Added explicit methods**: Specified allowed HTTP methods including OPTIONS
- **Added allowed headers**: Explicitly allowed `Authorization` and `Content-Type` headers

### 2. Rate Limiter Updates
- **Skip OPTIONS requests**: Preflight OPTIONS requests are now excluded from rate limiting

### 3. Changes Made to `server.js`

```javascript
// CORS is now applied BEFORE helmet
app.use(cors(corsOptions));

// Helmet configured to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));
```

## Deployment Steps

### 1. Update Render Environment Variables

Go to your Render dashboard and ensure these environment variables are set:

```
FRONTEND_URL=https://anergiafrontend.vercel.app
NODE_ENV=production
```

### 2. Redeploy Backend

**Option A: Automatic (if auto-deploy is enabled)**
- Push the updated `server.js` to your GitHub repository
- Render will automatically detect and deploy the changes

**Option B: Manual**
1. Go to Render dashboard
2. Click on your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### 3. Verify CORS is Working

After deployment, test the CORS configuration:

```bash
# Test preflight request
curl -X OPTIONS https://anergia-backend.onrender.com/api/admin/login \
  -H "Origin: https://anergiafrontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should return:
# Access-Control-Allow-Origin: https://anergiafrontend.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
# Access-Control-Allow-Headers: Content-Type, Authorization
```

### 4. Test from Frontend

1. Open your frontend: https://anergiafrontend.vercel.app
2. Try to log in to the admin panel
3. Check browser console - CORS errors should be gone

## Troubleshooting

### Still Getting CORS Errors?

1. **Check Render Logs**
   - Go to Render dashboard → Your service → Logs
   - Look for any CORS-related errors or warnings

2. **Verify Environment Variables**
   - Ensure `FRONTEND_URL` is set correctly in Render
   - Check that `NODE_ENV=production` is set

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private mode

4. **Check Network Tab**
   - Open browser DevTools → Network tab
   - Look for the OPTIONS request (preflight)
   - Check if it returns 200 with proper CORS headers

5. **Test Backend Directly**
   ```bash
   # Test if backend is responding
   curl https://anergia-backend.onrender.com/health
   
   # Test CORS headers
   curl -H "Origin: https://anergiafrontend.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        https://anergia-backend.onrender.com/api/admin/login \
        -v
   ```

### Common Issues

**Issue**: "No 'Access-Control-Allow-Origin' header"
- **Solution**: Backend hasn't been redeployed with new CORS config

**Issue**: "Preflight request doesn't pass access control check"
- **Solution**: Check that OPTIONS requests are not being blocked by rate limiter

**Issue**: CORS works locally but not in production
- **Solution**: Verify `FRONTEND_URL` environment variable is set in Render

## Expected CORS Headers

After the fix, responses should include:

```
Access-Control-Allow-Origin: https://anergiafrontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
```

## Additional Notes

- The CORS configuration allows all `.vercel.app` domains automatically
- Localhost is allowed for development
- Credentials are enabled for cookie-based authentication
- OPTIONS requests are excluded from rate limiting



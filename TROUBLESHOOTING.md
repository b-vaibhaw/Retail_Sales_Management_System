# Troubleshooting: Frontend Blank When Backend Starts

## Issue Description
Frontend appears blank or shows "No transactions found" when the backend is running, but works fine without the backend.

## Root Causes & Solutions

### 1. **Backend Not Running or Not Responding** ✓ FIXED
**Symptoms:** Frontend shows blank page or "Failed to fetch transactions" error

**Fix Applied:**
- Enhanced error messages in `App.jsx` to show specific backend connection errors
- Added detailed logging in backend (`index.js`) to track requests
- Frontend now displays: "Cannot connect to backend. Make sure the backend server is running on http://localhost:5000"

**How to verify:**
- Open browser console (F12) and check for error messages
- Test backend directly: `http://localhost:5000/api/transactions`
- Check backend logs in terminal for request logs

---

### 2. **CORS (Cross-Origin) Issues** ✓ FIXED
**Symptoms:** Browser console shows CORS errors, requests blocked

**Fix Applied:**
- Updated backend (`Backend/src/index.js`) with explicit CORS configuration
- Now accepts requests from all origins in development mode
- Supports credentials and all necessary HTTP methods

**To verify CORS is working:**
```javascript
// Open browser console and run:
fetch('http://localhost:5000/api/transactions')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

### 3. **Environment Variable Not Set** ✓ VERIFIED
**Symptoms:** Frontend tries to connect to wrong URL

**Current Setup:**
- `.env` file configured with: `VITE_API_URL=http://localhost:5000/api`
- `.env.production` created for production deployment

**If changing the URL:**
1. Update `Frontend/.env` with your backend URL
2. Restart the frontend dev server

---

## Step-by-Step Debugging

### Step 1: Check Backend is Running
```powershell
cd Backend
npm start
```
Look for: `🚀 Server running on port 5000`

### Step 2: Check Backend Health
Visit in browser: `http://localhost:5000/health`
Should see: `{"status":"OK","timestamp":"..."}`

### Step 3: Check Frontend API Calls
1. Open Frontend in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for messages like:
   - `API Request: GET http://localhost:5000/api/transactions` ✓ Good
   - `API Error: Cannot connect to backend...` ✗ Backend not running
   - `CORS policy error...` ✗ CORS issue

### Step 4: Test API Endpoint Directly
```powershell
# Test in PowerShell
$url = "http://localhost:5000/api/transactions"
Invoke-WebRequest -Uri $url | ConvertTo-Json
```

---

## Common Issues & Quick Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Frontend blank after backend starts | Backend not running | Run `npm start` in Backend folder |
| "Cannot connect to backend" error | Wrong API URL | Check `.env` file has correct URL |
| "No transactions found" | No data loaded | Ensure `Backend/data/sales.csv` exists |
| CORS error in console | CORS not configured | CORS has been fixed in `index.js` |
| 500 error on API | Data loading failed | Check console logs in backend terminal |

---

## Files Modified

1. **Frontend/src/App.jsx**
   - Enhanced error handling with specific error messages
   - Better error display for backend connection issues

2. **Backend/src/index.js**
   - Explicit CORS configuration
   - Request logging middleware
   - Support for all HTTP methods

3. **Frontend/src/services/api.js**
   - Detailed error logging showing backend connectivity issues
   - Better error distinction (network vs response errors)

4. **Frontend/.env.production**
   - Created for production deployment

---

## Testing After Fixes

1. Start Backend:
   ```powershell
   cd Backend
   npm start
   ```

2. In another terminal, start Frontend:
   ```powershell
   cd Frontend
   npm run dev
   ```

3. Open browser to `http://localhost:5173`

4. Check browser console for any errors

5. If still blank, verify:
   - Backend health: `http://localhost:5000/health`
   - API response: `http://localhost:5000/api/transactions`
   - Browser console shows actual error message

---

## Production Deployment

When deploying to production:

1. **Backend URL:** Update in `Frontend/.env.production`
2. **CORS Origin:** Set `FRONTEND_URL` environment variable on backend
3. **Data File:** Ensure `Backend/data/sales.csv` is included in deployment
4. **Node Version:** Verify both frontend and backend use compatible Node versions


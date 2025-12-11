# Deployment Guide - TruEstate Sales Management System

## Quick Deployment Checklist
- [ ] Backend deployed and URL obtained
- [ ] Frontend environment variable updated with backend URL
- [ ] Frontend deployed
- [ ] Both apps tested and working
- [ ] GitHub repository created and pushed
- [ ] README updated with live URLs

---

## Option 1: Deploy Backend to Render (Recommended)

### Step 1: Prepare Your Code
1. Ensure `backend/data/sales.json` exists with your dataset
2. Commit all changes to Git

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `truestate-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Click "Create Web Service"
6. Wait 2-3 minutes for deployment
7. Copy your backend URL (e.g., `https://truestate-backend.onrender.com`)

### Important Notes for Render:
- Free tier sleeps after 15 mins of inactivity (first request may be slow)
- Add `/api/health` to check if backend is running

---

## Option 2: Deploy Backend to Railway

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app) and login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js
5. Add these settings:
   - **Root Directory**: `/backend`
   - **Start Command**: `npm start`
6. Click "Deploy"
7. Go to Settings → Generate Domain
8. Copy your backend URL

---

## Deploy Frontend to Vercel

### Step 1: Update Environment Variable
Before deploying, create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

6. Click "Deploy"
7. Wait 1-2 minutes
8. Copy your frontend URL (e.g., `https://truestate-sales.vercel.app`)

---

## Option 2: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repo
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

6. Click "Deploy site"

---

## Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Get filter options
curl https://your-backend-url.onrender.com/api/filter-options

# Get transactions
curl https://your-backend-url.onrender.com/api/transactions?page=1&limit=10
```

### Test Frontend
1. Open your frontend URL in browser
2. Check if data loads
3. Test search functionality
4. Test filters
5. Test sorting
6. Test pagination
7. Check browser console for errors

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" error in frontend
**Solution**: Check CORS is enabled in backend and `VITE_API_URL` is set correctly

### Issue 2: Backend returns 500 error
**Solution**: Check backend logs on Render/Railway dashboard. Likely missing `sales.json` file

### Issue 3: Data not loading
**Solution**: 
- Verify backend URL is correct with `/api` suffix
- Check Network tab in browser DevTools
- Ensure backend is awake (Render free tier sleeps)

### Issue 4: Blank page on frontend
**Solution**:
- Check browser console for errors
- Verify all files are committed to Git
- Check Vercel/Netlify build logs

---

## Environment Variables Summary

### Backend (.env) - Optional
```
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## GitHub Repository Setup

### Create Repository
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TruEstate Sales Management System"

# Create GitHub repo (on github.com)
# Then link and push:
git remote add origin https://github.com/yourusername/truestate-assignment.git
git branch -M main
git push -u origin main
```

### Repository Checklist
- [ ] All code files committed
- [ ] `.gitignore` properly configured
- [ ] `README.md` updated with live URLs
- [ ] `docs/architecture.md` included
- [ ] Repository is public

---

## Final Submission Checklist

### 1. Live Application URL ✅
- Frontend URL: `https://your-app.vercel.app`
- Test all features work

### 2. GitHub Repository URL ✅
- Repository: `https://github.com/yourusername/truestate-assignment`
- Ensure it's public

### 3. README.md Format ✅
Must contain:
1. Overview (3-5 lines)
2. Tech Stack
3. Search Implementation Summary
4. Filter Implementation Summary
5. Sorting Implementation Summary
6. Pagination Implementation Summary
7. Setup Instructions

### 4. Architecture Document ✅
Located at: `/docs/architecture.md`
Must contain:
- Backend architecture
- Frontend architecture
- Data flow
- Folder structure
- Module responsibilities

---

## Performance Tips

1. **Enable Compression**: Add compression middleware to Express
2. **Optimize Images**: Use optimized images/icons
3. **Lazy Loading**: Consider React.lazy for components
4. **Caching**: Add caching headers in production
5. **Minification**: Ensure production builds are minified

---

## Monitoring Your App

### Backend Logs (Render)
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Monitor for errors

### Frontend Errors
1. Open browser DevTools (F12)
2. Check Console tab
3. Check Network tab for failed requests

---

## Quick Deploy Commands

### Deploy Backend (if using Render CLI)
```bash
cd backend
render-cli deploy
```

### Deploy Frontend (if using Vercel CLI)
```bash
cd frontend
vercel --prod
```

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test backend API directly with curl
4. Check browser console
5. Review CORS settings

---

## Success Indicators

✅ Backend health endpoint returns 200
✅ Frontend loads without errors
✅ Search functionality works
✅ All filters apply correctly
✅ Sorting changes data order
✅ Pagination navigates between pages
✅ No console errors
✅ Responsive design works on mobile

---

Good luck with your deployment! 🚀
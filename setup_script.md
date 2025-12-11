# Quick Setup Instructions

## 📋 Prerequisites
- Node.js 16+ installed
- npm or yarn
- Git installed
- Code editor (VS Code recommended)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Project Structure
```bash
# Create main directory
mkdir truestate-assignment
cd truestate-assignment

# Create subdirectories
mkdir -p backend/src/{controllers,services,routes,utils,data}
mkdir -p frontend/src/{components,services}
mkdir docs
```

### Step 2: Setup Backend

```bash
cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors dotenv

# Install dev dependencies
npm install --save-dev nodemon

# Update package.json scripts
```

Add to `backend/package.json`:
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

### Step 3: Add Your Dataset
```bash
# Place your sales.json file here
# backend/data/sales.json
```

**Important**: Download the dataset from the Google Drive link and save it as `backend/data/sales.json`

### Step 4: Copy Backend Code
Copy these files from the artifacts I created:
1. `backend/src/index.js`
2. `backend/src/controllers/salesController.js`
3. `backend/src/services/salesService.js`
4. `backend/src/routes/salesRoutes.js`
5. `backend/src/utils/dataLoader.js`

### Step 5: Test Backend
```bash
# From backend directory
npm run dev

# Should see: "Server running on port 5000"
# Test: http://localhost:5000/health
```

---

### Step 6: Setup Frontend

```bash
cd ../frontend

# Create Vite + React project
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install axios
npm install axios
```

### Step 7: Copy Frontend Code
Copy these files:
1. `frontend/src/App.jsx` (replace existing)
2. `frontend/src/App.css` (replace existing)
3. `frontend/src/main.jsx` (replace existing)
4. `frontend/src/services/api.js` (create new)
5. Create `frontend/src/components/` folder and add all component files:
   - SearchBar.jsx
   - FilterPanel.jsx
   - TransactionTable.jsx
   - SortingControls.jsx
   - Pagination.jsx
   - Stats.jsx

### Step 8: Create Environment File
```bash
# In frontend directory
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Step 9: Test Frontend
```bash
# From frontend directory
npm run dev

# Should open http://localhost:5173
```

---

## 📝 Create Documentation

### Step 10: Create README.md
Copy the main `README.md` content I provided to the root directory

### Step 11: Create Architecture Doc
```bash
# From root directory
# Copy docs/architecture.md content
```

---

## 🧪 Testing Everything Works

### Test Checklist:
1. ✅ Backend responds at http://localhost:5000/health
2. ✅ Backend returns filter options at http://localhost:5000/api/filter-options
3. ✅ Frontend loads at http://localhost:5173
4. ✅ Search bar appears
5. ✅ Filters panel shows on left
6. ✅ Data table displays (if dataset is loaded)
7. ✅ Pagination controls visible
8. ✅ No console errors

### Common Issues:

**Backend won't start:**
- Check if `sales.json` exists in `backend/data/`
- Check Node.js version (16+)
- Check port 5000 is not in use

**Frontend won't start:**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check if Vite is installed

**Data not loading:**
- Check backend is running
- Check `.env` file has correct URL
- Check browser Network tab for errors
- Verify CORS is enabled in backend

---

## 📁 File Structure Verification

Your structure should look like this:

```
truestate-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── services/
│   │   │   └── salesService.js
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   ├── utils/
│   │   │   └── dataLoader.js
│   │   └── index.js
│   ├── data/
│   │   └── sales.json
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── SortingControls.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── Stats.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
├── .gitignore
└── README.md
```

---

## 🎯 Next Steps

1. **Test locally** - Make sure everything works
2. **Customize styling** - Adjust colors/layout if needed
3. **Add your dataset** - Download and place sales.json
4. **Create GitHub repo** - Initialize and push
5. **Deploy** - Follow DEPLOYMENT_GUIDE.md
6. **Submit** - Send GitHub URL + Live URLs

---

## 💡 Tips

1. **Use VS Code**: Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

2. **Keep terminals open**: 
   - Terminal 1: Backend (`npm run dev`)
   - Terminal 2: Frontend (`npm run dev`)

3. **Check browser console**: F12 to open DevTools

4. **Git commits**: Commit frequently
   ```bash
   git add .
   git commit -m "Add feature X"
   ```

---

## 🆘 Need Help?

### Backend not working?
```bash
# Check if running
curl http://localhost:5000/health

# Check logs in terminal
# Look for error messages
```

### Frontend not showing data?
```bash
# Check browser console (F12)
# Check Network tab for failed requests
# Verify backend URL in .env
```

### Still stuck?
- Re-read error messages carefully
- Check file names match exactly
- Verify all files are in correct folders
- Ensure both backend and frontend are running

---

## ⏰ Time Management

- **Setup**: 30 minutes
- **Testing**: 30 minutes
- **Deployment**: 1 hour
- **Documentation**: 30 minutes
- **Buffer**: 30 minutes
- **Total**: ~3 hours

---

Good luck! You've got this! 🚀
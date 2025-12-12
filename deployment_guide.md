# **Deployment Guide — TruEstate Retail Sales Management System**

This document explains how to deploy the **Retail Sales Management System** (Backend + Frontend) to the cloud using **Render**. It covers environment setup, build steps, SQLite handling, API configuration, and post-deployment validation.


# **1. Overview**

The project contains:

* **Backend** — Node.js + Express + SQLite
* **Frontend** — React (Vite)
* **Monorepo layout** with separate folders
* **Public API endpoints** used by the frontend

This guide documents the exact steps required to deploy both services on **Render**.


# **2. Deployment Architecture**

```
Render Cloud
│
├── Backend Web Service (Node.js)
│     • Runs Express server
│     • Serves /api/* endpoints
│     • Loads SQLite database at runtime
│     • Exposes a public HTTPS endpoint
│
└── Frontend Static Site (React + Vite)
      • Deployed as static build
      • Environment variable: VITE_API_URL = backend URL
      • Communicates with backend only via HTTPS
```


# **3. Backend Deployment (Render Web Service)**

### **3.1 Requirements**

* Node.js 18+
* SQLite database file inside:

  ```
  /backend/data/truestate.db
  ```

### **3.2 Repository Path**

```
root/backend
```

### **3.3 Start Command**

In Render → **Build Command**:

```
npm install
```

**Start Command:**

```
npm run dev
```

or (recommended in production):

```
node src/index.js
```

### **3.4 Environment Variables**

Add in Render dashboard:

| KEY      | VALUE                    |
| -------- | ------------------------ |
| PORT     | 10000 (or leave default) |
| NODE_ENV | production               |

### **3.5 SQLite Considerations**

* SQLite file must be inside repository
* Path must work on Render’s ephemeral filesystem
* Recommended location:

```
backend/data/truestate.db
```

Backend logs will confirm:

```
SQLite database initialized
```


# **4. Frontend Deployment (Render Static Site)**

### **4.1 Repository Path**

```
root/frontend
```

### **4.2 Build Command**

```
npm install && npm run build
```

### **4.3 Publish Directory**

```
dist
```

### **4.4 Environment Variables**

You **must** set the backend URL so the React app knows where to send API requests:

```
VITE_API_URL = https://<your-backend-service>.onrender.com
```

This is used in:

```
frontend/src/services/api.js
```

### **4.5 Required Code in api.js**

Example (final working format):

```js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTransactions(params) {
  const res = await api.get("/api/transactions", { params });
  return res.data;
}

export async function getFilterOptions() {
  const res = await api.get("/api/filter-options");
  return res.data;
}
```


# **5. Connecting Frontend → Backend**

After both services deploy:

1. Go to **Render Backend URL**, example:

   ```
   https://retail-backend.onrender.com
   ```
2. Append endpoints to verify:

   ```
   /api/transactions
   /api/filter-options
   ```
3. Confirm **CORS is enabled** in backend `index.js`:

```js
import cors from "cors";
app.use(cors());
```

4. In frontend logs, confirm requests look like:

```
GET https://retail-backend.onrender.com/api/transactions
```

---

# **6. Troubleshooting**

### **6.1 Frontend shows no data**

* Check Network tab → Request URL must begin with backend URL
* Ensure VITE_API_URL is set correctly
* Confirm backend returns JSON
* Mixed-content error → Ensure backend is HTTPS

### **6.2 Backend returns 404**

Ensure routes exist:

```
/api/transactions
/api/filter-options
```

### **6.3 SQLite not loading on Render**

Verify path in backend logs:

```
backend/data/truestate.db
```

### **6.4 CORS errors**

Add in backend:

```js
app.use(cors());
```


# **7. Deployment Verification Checklist**

### **Backend**

✔ Server starts on Render
✔ SQLite initialized
✔ `/api/transactions` works
✔ `/api/filter-options` works
✔ CORS enabled

### **Frontend**

✔ Renders UI
✔ API calls hit backend
✔ Search works
✔ Filters work
✔ Sorting works
✔ Pagination (10 per page) works


# **8. Final Deliverables for Submission**

| Deliverable              | Description                            |
| ------------------------ | -------------------------------------- |
| **Live Frontend URL**    | Render Static Site                     |
| **Live Backend URL**     | Render Web Service                     |
| **GitHub Repo**          | Full project with monorepo structure   |
| **README.md**            | Follows assignment’s required sections |
| **docs/architecture.md** | Architecture, flow, folder structure   |
| **docs/Deployment.md**   | (this file)                            |


# **9. Notes**

* Render filesystem is ephemeral → SQLite works but cannot persist writes across deploys
* For real use, move to PostgreSQL
* Frontend must be rebuilt when backend URL changes

# Currently there is a bug in frontend-(facing issue on frontend website during data loading)

Just say **"Generate README"** or **"Generate architecture.md"**.

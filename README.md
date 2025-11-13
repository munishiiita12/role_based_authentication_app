# Full-Stack Role-Based Authentication App

A modern full-stack application built with **Next.js**, **Express**, **MongoDB**, and **JWT** authentication. Features role-based access control where users can manage their own items, while admins have access to all items.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start Guide](#quick-start-guide)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - MongoDB installed locally, OR
  - A MongoDB Atlas account (free tier available) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js) or **yarn**

### Verify Installation

Open your terminal/command prompt and run:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show version number
```

---

## Quick Start Guide

### Step 1: Clone or Download the Project

If you haven't already, navigate to the project directory:

```bash
cd new_project
```

### Step 2: Set Up Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder with the following content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/role_auth_app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=1d
   JWT_COOKIE_MAX_AGE=86400000
   CLIENT_URL=http://localhost:3000
   ```

   **Note:** If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/role_auth_app
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see: `Server listening on port 5000` and `MongoDB connected`

### Step 3: Set Up Frontend

1. Open a **new terminal window** (keep the backend running)

2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see: `Ready on http://localhost:3000`

### Step 4: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

🎉 **You're all set!** The application should now be running.

---

## Detailed Setup Instructions

### Backend Setup

#### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs all required packages:
- Express (web framework)
- Mongoose (MongoDB ODM)
- JWT (authentication)
- bcryptjs (password hashing)
- Zod (validation)
- And more...

#### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder:

**For Local MongoDB:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/role_auth_app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d
JWT_COOKIE_MAX_AGE=86400000
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGO_URI` in `.env` with your Atlas connection string

**Important:** 
- Change `JWT_SECRET` to a strong random string in production
- `JWT_COOKIE_MAX_AGE` is in milliseconds (86400000 = 24 hours)

#### 3. Start MongoDB (if using local MongoDB)

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start it manually:
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### 4. Run the Backend

```bash
npm run dev
```

The backend will:
- Connect to MongoDB
- Start the Express server on port 5000
- Enable hot-reload with nodemon

**Expected output:**
```
MongoDB connected
Server listening on port 5000
```

---

### Frontend Setup

#### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- Next.js (React framework)
- React
- Tailwind CSS (styling)
- Zod (validation)

#### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** If your backend runs on a different port, update this URL accordingly.

#### 3. Run the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

**Expected output:**
```
  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Ready in X seconds
```

---

## Running the Application

### Development Mode

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   ```
   http://localhost:3000
   ```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## Project Structure

```
new_project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   └── itemController.js  # Item CRUD operations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification
│   │   │   └── roleMiddleware.js  # Role-based access
│   │   ├── models/
│   │   │   ├── User.js        # User schema
│   │   │   └── Item.js        # Item schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js  # Auth endpoints
│   │   │   └── itemRoutes.js  # Item endpoints
│   │   ├── utils/
│   │   │   └── validators.js   # Zod validation schemas
│   │   ├── app.js             # Express app configuration
│   │   └── server.js          # Server entry point
│   ├── package.json
│   └── .env                   # Environment variables (create this)
│
└── frontend/
    ├── app/
    │   ├── dashboard/
    │   │   └── page.js        # Dashboard page
    │   ├── login/
    │   │   └── page.js        # Login page
    │   ├── signup/
    │   │   └── page.js        # Signup page
    │   ├── layout.js          # Root layout
    │   └── page.js           # Home page
    ├── lib/
    │   └── api.js             # API client functions
    ├── package.json
    └── .env.local             # Environment variables (create this)
```

---

## API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Item Endpoints (`/api/items`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/items?page=1&limit=10&search=` | Get items (paginated) | Yes |
| POST | `/api/items` | Create a new item | Yes |
| PATCH | `/api/items/:id` | Update an item | Yes (owner or admin) |
| DELETE | `/api/items/:id` | Delete an item | Yes (owner or admin) |

**Note:** 
- Regular users can only see and manage their own items
- Admins can see and manage all items

---

## Features

✅ **User Authentication**
- Secure signup and login with JWT tokens
- HTTP-only cookies for token storage
- Password hashing with bcrypt

✅ **Role-Based Access Control**
- Two roles: `user` and `admin`
- Users can only manage their own items
- Admins can see and manage all items

✅ **Item Management**
- Create, read, update, and delete items
- Search functionality
- Pagination support
- Status tracking (todo, in-progress, done)

✅ **Validation**
- Client-side validation with Zod
- Server-side validation with Zod
- Form error handling

✅ **Modern UI**
- Responsive design with Tailwind CSS
- Role-aware dashboard messaging
- Loading states and error handling

---

## Troubleshooting

### Backend Issues

**Problem: "MongoDB connected" message doesn't appear**
- ✅ Check if MongoDB is running: `mongosh` (should connect)
- ✅ Verify `MONGO_URI` in `.env` is correct
- ✅ For Atlas: Check network access and connection string

**Problem: "Port 5000 already in use"**
- ✅ Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- ✅ Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

**Problem: "JWT_SECRET not set"**
- ✅ Make sure `.env` file exists in `backend` folder
- ✅ Check that `JWT_SECRET` is set in `.env`

### Frontend Issues

**Problem: "Cannot connect to API"**
- ✅ Verify backend is running on port 5000
- ✅ Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- ✅ Ensure CORS is configured correctly in backend

**Problem: "Module not found" errors**
- ✅ Run `npm install` in both `backend` and `frontend` folders
- ✅ Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem: Page shows blank or errors**
- ✅ Check browser console for errors (F12)
- ✅ Verify both backend and frontend are running
- ✅ Check network tab for failed API requests

### General Issues

**Problem: Changes not reflecting**
- ✅ Backend: Restart the server (nodemon should auto-restart)
- ✅ Frontend: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- ✅ Clear browser cache

**Problem: Authentication not working**
- ✅ Check browser cookies are enabled
- ✅ Verify JWT_SECRET is set correctly
- ✅ Check browser console for cookie-related errors

---

## Next Steps

1. **Sign Up**: Create an account at `/signup`
   - Choose role: `user` or `admin`
   - Fill in name, email, and password

2. **Login**: Sign in at `/login`

3. **Dashboard**: Access the dashboard at `/dashboard`
   - Create items
   - Search and filter items
   - Edit or delete your items
   - Admins can see all items

---

## Deployment to Vercel

This guide will walk you through deploying both the frontend and backend to Vercel step by step.

### Prerequisites

Before deploying, make sure you have:

1. ✅ **GitHub account** - [Sign up here](https://github.com/)
2. ✅ **Vercel account** - [Sign up here](https://vercel.com/) (free tier available)
3. ✅ **MongoDB Atlas account** - [Sign up here](https://www.mongodb.com/cloud/atlas) (free tier available)
4. ✅ **Git installed** on your computer

---

## Step-by-Step Deployment Guide

### Part 1: Prepare Your Code for Deployment

#### 1.1 Initialize Git Repository (if not already done)

```bash
# In the project root directory
git init
git add .
git commit -m "Initial commit"
```

#### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it (e.g., `role-auth-app`)
4. **Don't** initialize with README (you already have one)
5. Click **"Create repository"**

#### 1.3 Push Code to GitHub

GitHub will show you commands. Run these in your project root:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

---

### Part 2: Set Up MongoDB Atlas (Cloud Database)

Since Vercel uses serverless functions, you need a cloud database. MongoDB Atlas is free and perfect for this.

#### 2.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details and verify your email

#### 2.2 Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier)
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create"** (takes 1-3 minutes)

#### 2.3 Set Up Database Access

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
5. Set privileges to **"Atlas admin"**
6. Click **"Add User"**

#### 2.4 Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add specific IPs for production
4. Click **"Confirm"**

#### 2.5 Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/role_auth_app`

**Save this connection string!** You'll need it for the backend deployment.

---

### Part 3: Deploy Backend to Vercel

#### 3.1 Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

#### 3.2 Deploy Backend via Vercel Dashboard

**Important:** The project includes `backend/vercel.json` and `backend/api/index.js` files that configure the Express app for Vercel's serverless functions. These files are already in the repository.

**Option A: Using Vercel Dashboard (Easier)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** Leave empty (or `npm install`)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`
5. Click **"Environment Variables"** and add these:

   ```
   PORT=5000
   MONGO_URI=your-mongodb-atlas-connection-string-here
   JWT_SECRET=your-super-secret-random-string-here
   JWT_EXPIRES_IN=1d
   JWT_COOKIE_MAX_AGE=86400000
   CLIENT_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

   **Important Notes:**
   - Replace `your-mongodb-atlas-connection-string-here` with your Atlas connection string from Step 2.5
   - Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)
   - For `CLIENT_URL`, you'll update this after deploying the frontend

6. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
cd backend
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name? (Press Enter for default)
- Directory? (Press Enter, it should detect `backend`)
- Override settings? **No**

Then set environment variables:

```bash
vercel env add MONGO_URI
# Paste your MongoDB Atlas connection string

vercel env add JWT_SECRET
# Enter your secret key

vercel env add JWT_EXPIRES_IN
# Enter: 1d

vercel env add JWT_COOKIE_MAX_AGE
# Enter: 86400000

vercel env add CLIENT_URL
# Enter: https://your-frontend-url.vercel.app (update after frontend deploy)

vercel env add NODE_ENV
# Enter: production

vercel env add PORT
# Enter: 5000
```

#### 3.3 Get Backend URL

After deployment:
1. Go to your project in Vercel dashboard
2. Copy the deployment URL (e.g., `https://your-backend.vercel.app`)
3. **Save this URL!** You'll need it for the frontend

**Note:** Your backend API will be available at: `https://your-backend.vercel.app/api`

---

### Part 4: Deploy Frontend to Vercel

#### 4.1 Deploy Frontend via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the **same** GitHub repository
4. Configure the project:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
5. Click **"Environment Variables"** and add:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
   ```

   Replace `your-backend-url.vercel.app` with your actual backend URL from Step 3.3

6. Click **"Deploy"**

#### 4.2 Update Backend CLIENT_URL

After frontend deployment:

1. Go to your **backend project** in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Update `CLIENT_URL` to your frontend URL:
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
4. **Redeploy** the backend (go to Deployments → click "..." → Redeploy)

---

### Part 5: Verify Deployment

#### 5.1 Test Your Application

1. Open your frontend URL (e.g., `https://your-frontend.vercel.app`)
2. Try signing up a new user
3. Try logging in
4. Test creating items in the dashboard

#### 5.2 Check Backend Logs

1. Go to Vercel dashboard → Your backend project
2. Click **"Deployments"** → Select latest deployment
3. Click **"Functions"** tab to see serverless function logs
4. Check for any errors

#### 5.3 Common Issues

**Problem: "Cannot connect to API"**
- ✅ Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend
- ✅ Check backend URL is accessible
- ✅ Verify CORS settings in backend allow your frontend domain

**Problem: "MongoDB connection failed"**
- ✅ Verify `MONGO_URI` is correct in backend environment variables
- ✅ Check MongoDB Atlas network access allows all IPs (or Vercel IPs)
- ✅ Verify database user credentials are correct

**Problem: "Authentication not working"**
- ✅ Check `JWT_SECRET` is set in backend
- ✅ Verify `CLIENT_URL` matches your frontend URL exactly
- ✅ Check browser console for cookie errors

---

### Part 6: Custom Domains (Optional)

#### 6.1 Add Custom Domain to Frontend

1. Go to Vercel dashboard → Frontend project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions

#### 6.2 Add Custom Domain to Backend

1. Go to Vercel dashboard → Backend project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update `NEXT_PUBLIC_API_URL` in frontend to use new domain
5. Update `CLIENT_URL` in backend to use frontend domain

---

## Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas cluster is created and accessible
- [ ] Database user is created with proper permissions
- [ ] Network access is configured in MongoDB Atlas
- [ ] Connection string is ready
- [ ] Strong JWT_SECRET is generated
- [ ] Backend is deployed to Vercel
- [ ] All backend environment variables are set
- [ ] Frontend is deployed to Vercel
- [ ] Frontend environment variable points to backend
- [ ] Backend CLIENT_URL is updated with frontend URL
- [ ] Application is tested and working

---

## Quick Reference: Environment Variables

### Backend Environment Variables (Vercel)

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/role_auth_app
JWT_SECRET=your-super-secret-random-string-min-32-chars
JWT_EXPIRES_IN=1d
JWT_COOKIE_MAX_AGE=86400000
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables (Vercel)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

---

## Updating Your Deployment

After making code changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Vercel will automatically redeploy** both frontend and backend

3. **Or manually redeploy:**
   - Go to Vercel dashboard
   - Select your project
   - Click **"Deployments"** → **"Redeploy"**

---

## Cost Information

**Vercel Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Serverless functions (generous limits)
- ✅ Automatic HTTPS
- ✅ Custom domains

**MongoDB Atlas Free Tier Includes:**
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Perfect for development and small apps

**Total Cost: $0/month** for small to medium applications! 🎉

---

## Alternative: Deploy Backend to Render/Railway

If you prefer a traditional server setup instead of serverless:

### Render.com

1. Sign up at [Render.com](https://render.com/)
2. Create new **Web Service**
3. Connect GitHub repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add all environment variables
8. Deploy

### Railway.app

1. Sign up at [Railway.app](https://railway.app/)
2. Create new project from GitHub
3. Add service → Select backend folder
4. Add environment variables
5. Deploy

Then update `NEXT_PUBLIC_API_URL` in frontend to point to Render/Railway URL.

---

## Support

If you encounter any issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Check that both servers are running

---



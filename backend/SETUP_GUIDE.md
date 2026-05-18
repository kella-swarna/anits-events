# 🚀 Backend Server Setup Guide

## ❌ Current Issue: "Server error during upload"

The error occurs because the backend server is not running or MongoDB is not connected.

## ✅ Solution Steps:

### 1. **Check MongoDB Status**
```bash
# If using local MongoDB:
mongod --version
# Start MongoDB service if not running

# If using MongoDB Atlas:
# Make sure your connection string is correct
```

### 2. **Create .env File**
Create a file named `.env` in the `backend` folder with this content:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/college_events
JWT_SECRET=your_jwt_secret_key_here_change_this_to_a_long_random_string
ADMIN_EMAIL=admin@anits.edu
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3001
UPLOAD_PATH=uploads/
```

### 3. **Start Backend Server**
```bash
cd backend
npm start
# OR
node server.js
# OR
node quick-start.js
```

### 4. **Verify Server is Running**
Open browser and go to: http://localhost:3000/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T...",
  "uptime": 123.456
}
```

### 5. **Start Frontend Server**
```bash
cd frontend
npx live-server --port=3001
```

## 🔧 Troubleshooting:

### If MongoDB Connection Fails:
1. **Local MongoDB**: Make sure MongoDB service is running
2. **MongoDB Atlas**: Check your connection string
3. **Firewall**: Check if port 27017 is blocked

### If Server Won't Start:
1. Check if port 3000 is already in use
2. Check Node.js version: `node --version`
3. Install dependencies: `npm install`

### If Upload Still Fails:
1. Check browser console for errors
2. Check backend console for errors
3. Verify file upload permissions

## 📋 Quick Test:
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npx live-server --port=3001`
3. Open: http://localhost:3001
4. Try uploading an event

## 🎯 Expected Result:
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:3001
- ✅ Event upload works without errors
- ✅ Images display correctly

# Frontend-Backend Connection Fix Guide

## Current Status
- **Frontend**: https://69021cb08e0af3ad49a82de8--resilient-truffle-72a0cf.netlify.app/
- **Backend**: https://anits-events.onrender.com
- **Issue**: Events not loading - still showing "No coding events available at the moment"

## Verified Configuration ✅
- ✅ CORS is configured in backend for your Netlify URL
- ✅ Frontend API URL updated to `https://anits-events.onrender.com`
- ✅ Backend routes are properly set up

## Possible Issues & Fixes

### 1. **Backend is Sleeping (Most Likely - Render Free Tier)**
Render free tier services sleep after 15 minutes of inactivity.

**Fix:**
```bash
# Visit this URL to wake up the backend
https://anits-events.onrender.com/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-11-04T...",
  "uptime": ...
}
```

### 2. **MongoDB Connection Issue**

**Check:**
- Visit: https://anits-events.onrender.com/ 
- Should see: College Events API Server

**Fix if it fails:**
- Check Render dashboard > your backend service > Logs
- Look for MongoDB connection errors
- Verify `MONGODB_URI` in Render environment variables

### 3. **No Events in Database**

If backend is running but no events show:
- Events may not exist in MongoDB
- Admin must add events via `/admin/login.html`

**Workaround:**
- Visit your admin page: https://69021cb08e0af3ad49a82de8--resilient-truffle-72a0cf.netlify.app/admin-login.html
- Login and add some coding events

---

## Step-by-Step Debugging

### Step 1: Check Backend Health
```
URL: https://anits-events.onrender.com/health
Expected Status: 200 OK
```

### Step 2: Check Events Endpoint
```
URL: https://anits-events.onrender.com/api/events?type=coding
Expected: JSON response with events array
```

### Step 3: Check Browser Console
- Open: https://69021cb08e0af3ad49a82de8--resilient-truffle-72a0cf.netlify.app/
- Press F12 → Console tab
- Look for error messages
- The fetch call should go to `https://anits-events.onrender.com/api/events?type=coding`

### Step 4: Check Render Logs
- Go to: https://dashboard.render.com
- Select your backend service
- Check "Logs" tab for MongoDB or runtime errors

---

## Manual Testing Commands

### Test from Terminal (using curl):
```bash
# Test backend is alive
curl https://anits-events.onrender.com/health

# Test events endpoint
curl "https://anits-events.onrender.com/api/events?type=coding"
```

---

## Quick Fixes to Try

1. **Wake up backend** → Visit https://anits-events.onrender.com/health
2. **Hard refresh frontend** → Press Ctrl+Shift+R
3. **Clear browser cache** → Ctrl+Shift+Delete
4. **Add test events** → Use admin panel
5. **Check Render logs** → Look for errors

---

## Files Modified
- ✅ `backend/server.js` - CORS configured
- ✅ `frontend/codingevents.html` - API URL updated
- ✅ `frontend/noncoding.html` - API URL updated
- ✅ `frontend/nonanitsevents.html` - API URL updated
- ✅ `backend/models/User.js` - Fixed duplicate MongoDB indexes (Nov 4)

---

## Next Steps
1. Check if backend is responding at `/health`
2. Add some events using the admin panel
3. Hard refresh your frontend
4. Check browser console for any errors
5. Report any error messages you see in the console

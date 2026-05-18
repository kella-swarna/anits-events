# 🎓 College Events Management System

A full-stack web application for managing college events with modern UI and robust backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or Atlas)
- Modern web browser

### 1. Installation
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Database Setup
Make sure MongoDB is running:
- **Local MongoDB**: Start with `mongod`
- **MongoDB Atlas**: Update connection string in `backend/.env`

### 3. Start the Application

**Option A - Both servers together:**
```bash
npm run dev
```

**Option B - Separate terminals:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npx live-server --port=3001
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Setup Guide**: http://localhost:3001/setup.html

## 📱 Application Structure

```
mini_project/
├── frontend/           # React-like frontend (HTML/CSS/JS)
│   ├── index.html     # Main landing page
│   ├── codingevents.html    # Coding events page
│   ├── noncoding.html       # Non-coding events page
│   ├── nonanitsevents.html   # Non-ANITS events page
│   ├── page1.html           # Navigation page
│   ├── page2.html           # Secondary page
│   ├── admin-login.html     # Admin authentication
│   └── setup.html           # Setup guide
├── backend/            # Node.js/Express API
│   ├── server.js      # Main server file
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── uploads/       # File storage
│   └── .env          # Environment variables
└── package.json       # Root package file
```

## 🛠️ Features

### Frontend Features
- ✅ **Modern UI**: Glassmorphism design with beautiful animations
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Event Categories**: Coding, Non-coding, Non-ANITS, Other events
- ✅ **Google Authentication**: Sign in with Google
- ✅ **Admin Panel**: Special admin access for event management
- ✅ **Event Upload**: Create events with rich information
- ✅ **Search & Filter**: Find events by category and criteria

### Backend Features
- ✅ **RESTful API**: Clean and documented endpoints
- ✅ **MongoDB Integration**: Robust data storage
- ✅ **Authentication**: JWT-based auth with Google OAuth
- ✅ **Input Validation**: Comprehensive data validation
- ✅ **Security**: Rate limiting, CORS, helmet protection
- ✅ **File Upload**: Support for event images
- ✅ **Error Handling**: Graceful error management

## 🔐 Authentication

### User Login
- Google OAuth integration
- Email/password registration
- Profile management

### Admin Access
Default credentials (change in `backend/.env`):
- **Email**: admin@anits.edu
- **Password**: admin123

## 📊 API Endpoints

### Events
- `GET /api/events` - Get all events (with filtering)
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/admin-login` - Admin login

### Legacy (Frontend Compatibility)
- `GET /events` - Same as `/api/events`
- `POST /upload-event` - Create event (frontend format)

## 🏗️ Event Data Structure

```json
{
  "eventName": "Hackathon 2025",
  "eventDescription": "24-hour coding competition...",
  "type": "coding",
  "collegeName": "ANITS",
  "venue": "Computer Lab",
  "eventDate": "2025-03-15T09:00:00.000Z",
  "startTime": "09:00 AM",
  "endTime": "09:00 AM",
  "registrationLink": "https://example.com/register",
  "contactEmail": "event@anits.edu",
  "contactPhone": "+91-9876543210",
  "fee": 100,
  "maxParticipants": 50,
  "uploader": "Admin"
}
```

## 🔧 Configuration

### Backend Environment (`.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/college_events
JWT_SECRET=your_jwt_secret_key_here # Change this to a long, random string
ADMIN_EMAIL=admin@anits.edu
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3001
```

### Frontend Configuration
No additional configuration needed. The frontend automatically connects to the backend on `localhost:3000`.

## 📚 Usage Guide

### Creating Events
1. Sign in to the application
2. Use the upload form on the main page
3. Fill in event details
4. Select appropriate event type
5. Submit to save to database

### Viewing Events
- **Coding Events**: Visit `/codingevents.html`
- **Non-Coding Events**: Visit `/noncoding.html`
- **Non-ANITS Events**: Visit `/nonanitsevents.html`

### Admin Features
- Login with admin credentials
- Access to all event management features
- User management capabilities
- Event moderation and approval

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify port 3000 is available
- Check `.env` file configuration

**Frontend can't connect:**
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify frontend is on port 3001

**Database connection failed:**
- Check MongoDB service status
- Verify connection string in `.env`
- Ensure database permissions

### Health Checks
- Backend: http://localhost:3000/health
- Frontend: Check browser console for errors
- Database: Check MongoDB logs

## 🔄 Development

### Adding New Features
1. **Frontend**: Modify HTML/CSS/JS files
2. **Backend**: Add routes in `routes/` folder
3. **Database**: Update models in `models/` folder

### Testing
- Test API endpoints using tools like Postman
- Check frontend functionality in browser
- Verify database operations in MongoDB

## 🚀 Production Deployment

### Backend
- Set `NODE_ENV=production`
- Use secure JWT secret
- Configure production MongoDB URI
- Use process manager (PM2)

### Frontend
- Use proper web server (Nginx, Apache)
- Enable HTTPS
- Optimize assets
- Set up CDN

## 📞 Support

For issues or questions:
1. Check the setup guide: `frontend/setup.html`
2. Review API documentation in `backend/README.md`
3. Check browser console and server logs
4. Verify all dependencies are installed

## 🎉 Success!

If everything is working:
- ✅ Backend runs on http://localhost:3000
- ✅ Frontend runs on http://localhost:3001
- ✅ MongoDB is connected
- ✅ Events can be created and viewed
- ✅ Authentication works

Your college events management system is now ready for use! 🎓✨
=======
# ANITS-EVENTS-Mini_project
````

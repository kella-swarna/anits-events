# College Events Backend

A Node.js backend application for managing college events using Express.js and MongoDB.

## Features

- **Event Management**: Create, read, update, delete events
- **Event Categories**: Coding, Non-coding, Non-ANITS, and Other events
- **User Authentication**: Registration, login with JWT tokens
- **Google OAuth**: Sign in with Google support
- **Admin Panel**: Special admin access for event management
- **Search & Filtering**: Filter events by type, college, date, etc.
- **Pagination**: Efficient data loading
- **Input Validation**: Comprehensive validation for all inputs
- **Security**: Rate limiting, CORS, helmet protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Password Hashing**: bcryptjs

## Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env` file and update the values:
   ```bash
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/college_events
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ADMIN_EMAIL=admin@anits.edu
   ADMIN_PASSWORD=admin123
   FRONTEND_URL=http://localhost:3001
   ```

4. **Make sure MongoDB is running**:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env` file

5. **Start the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Events

- **GET** `/api/events` - Get all events (with filtering)
  - Query params: `type`, `page`, `limit`, `search`, `collegeName`, `featured`
- **POST** `/api/events` - Create new event
- **GET** `/api/events/:id` - Get single event
- **PUT** `/api/events/:id` - Update event
- **DELETE** `/api/events/:id` - Delete event
- **GET** `/api/events/college/:collegeName` - Get events by college

### Authentication

- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/google` - Google OAuth
- **POST** `/api/auth/admin-login` - Admin login
- **GET** `/api/auth/profile` - Get user profile (requires token)
- **PUT** `/api/auth/profile` - Update user profile (requires token)

### Legacy Routes (for backward compatibility)

- **GET** `/events` - Same as `/api/events`
- **POST** `/upload-event` - Same as `POST /api/events`

## Event Data Structure

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
  "image": "https://example.com/image.jpg",
  "fee": 100,
  "maxParticipants": 50,
  "tags": ["coding", "competition"],
  "uploader": "Admin",
  "featured": true,
  "prizes": [
    {
      "position": "First",
      "amount": 10000,
      "description": "Winner"
    }
  ],
  "organizers": [
    {
      "name": "John Doe",
      "role": "Event Coordinator",
      "contact": "john@anits.edu"
    }
  ]
}
```

## Event Types

- `coding` - Programming competitions, hackathons, tech workshops
- `noncoding` - Cultural events, sports, art exhibitions
- `nonanits` - Events from other colleges/institutions
- `other` - General events

## Frontend Integration

The backend is designed to work with your existing frontend. Key integration points:

1. **Existing API compatibility**: Supports your current `/events` and `/upload-event` endpoints
2. **Response format**: Returns events in the format your frontend expects
3. **CORS enabled**: Allows frontend requests from different ports

## Example Usage

### Creating an event via API:

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Web Development Workshop",
    "eventDescription": "Learn React and Node.js",
    "type": "coding",
    "collegeName": "ANITS",
    "uploader": "Admin"
  }'
```

### Getting coding events:

```bash
curl "http://localhost:3000/api/events?type=coding"
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated and sanitized
- **Password Hashing**: Passwords are hashed with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for your frontend domain
- **Helmet**: Security headers protection

## Development

For development with auto-restart:
```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Update MongoDB URI for production database
3. Change JWT_SECRET to a secure random string
4. Update ADMIN credentials
5. Configure proper CORS origins
6. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "college-events-api"
   ```

## Health Check

Visit `http://localhost:3000/health` to check if the server is running properly.

## Support

The backend supports all the functionality needed for your college events website:
- Event creation and management
- User authentication
- Admin controls
- Search and filtering
- Mobile-friendly API responses
- Scalable database structure

Your frontend will work seamlessly with this backend! 🚀
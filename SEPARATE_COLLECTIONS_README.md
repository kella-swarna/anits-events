# Separate Collections Implementation

## Overview
Updated the backend to store events in separate MongoDB collections based on their type.

## New Collections Structure
- **codingevents** - Stores all coding events
- **noncodingevents** - Stores all non-coding events
- **nonanitsevents** - Stores all non-ANITS events  
- **events** - Stores other/miscellaneous events (fallback)

## Changes Made

### 1. New Model Files Created
- `backend/models/CodingEvent.js` - Model for coding events
- `backend/models/NonCodingEvent.js` - Model for non-coding events
- `backend/models/NonAnitsEvent.js` - Model for non-ANITS events

Each model:
- Has the same schema as the original Event model
- Explicitly sets the collection name
- Has `type` field set to immutable (cannot be changed after creation)
- Includes proper indexes for performance

### 2. Updated Routes (`backend/routes/events.js`)
- Added imports for all three new models
- Created `getModelByType()` helper function to select correct model
- Updated POST `/upload-event` route to save to correct collection based on event type
- Updated GET `/api/events` route to:
  - Query specific collection when `type` parameter is provided
  - Query all collections when no type specified and merge results
- Updated GET `/api/events/:id` route to search across all collections

## How It Works

### Upload Event
When you upload an event:
1. Frontend sends event data with `type` field (coding/noncoding/nonanits)
2. Backend uses `getModelByType()` to select the correct model
3. Event is saved to the corresponding collection

Example:
```javascript
// Upload coding event → saved to 'codingevents' collection
// Upload non-coding event → saved to 'noncodingevents' collection
// Upload non-ANITS event → saved to 'nonanitsevents' collection
```

### Fetch Events
When fetching events:

**With type parameter:**
```
GET /api/events?type=coding
→ Queries only 'codingevents' collection
```

**Without type parameter:**
```
GET /api/events
→ Queries all collections and merges results
```

## Testing

### Step 1: Restart Backend Server
```bash
cd backend
npm start
```

### Step 2: Upload Test Events
Upload one event of each type through the frontend:
- Coding Event → Should save to `codingevents` collection
- Non-Coding Event → Should save to `noncodingevents` collection
- Non-ANITS Event → Should save to `nonanitsevents` collection

### Step 3: Verify in MongoDB
Check your MongoDB database:
- Database: `anits_events` (or `test` if using default)
- Collections should now include:
  - `codingevents`
  - `noncodingevents`
  - `nonanitsevents`

### Step 4: Test Fetching
```bash
# Fetch coding events only
curl http://localhost:5000/api/events?type=coding

# Fetch non-coding events only
curl http://localhost:5000/api/events?type=noncoding

# Fetch non-ANITS events only
curl http://localhost:5000/api/events?type=nonanits

# Fetch all events
curl http://localhost:5000/api/events
```

## Benefits
1. ✅ Better data organization
2. ✅ Easier to manage each event type separately
3. ✅ Better query performance (smaller collections)
4. ✅ Cleaner database structure
5. ✅ Each collection can have type-specific indexes

## Note
- Old events in the generic `events` collection will still be accessible
- New events will be saved to type-specific collections
- Frontend code doesn't need any changes!

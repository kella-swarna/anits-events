const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const CodingEvent = require('../models/CodingEvent');
const NonCodingEvent = require('../models/NonCodingEvent');
const NonAnitsEvent = require('../models/NonAnitsEvent');
const multer = require('multer');
const path = require('path');

// We need to get the upload middleware from server.js. A better way is to configure it in a separate file.
// For now, let's re-create a simple version here.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const router = express.Router();

// Helper function to get the correct model based on event type
function getModelByType(type) {
  switch(type) {
    case 'coding':
      return CodingEvent;
    case 'noncoding':
      return NonCodingEvent;
    case 'nonanits':
      return NonAnitsEvent;
    default:
      return Event; // Fallback to generic Event model for 'other' type
  }
}

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Event validation rules
const eventValidation = [
  body('eventName')
    .trim()
    .notEmpty()
    .withMessage('Event name is required')
    .isLength({ max: 100 })
    .withMessage('Event name cannot exceed 100 characters'),
  
  body('eventDescription')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 1000 })
    .withMessage('Event description cannot exceed 1000 characters'),
  
  body('type')
    .isIn(['coding', 'noncoding', 'nonanits', 'other'])
    .withMessage('Invalid event type'),
  
  body('collegeName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('College name cannot exceed 100 characters'),
  
  body('venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Venue cannot exceed 200 characters'),
  
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  
  body('registrationLink')
    .optional()
    .isURL()
    .withMessage('Registration link must be a valid URL'),
  
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Contact email must be valid'),
  
  body('contactPhone')
    .optional()
    .matches(/^[\d\s\+\-\(\)]{10,15}$/)
    .withMessage('Contact phone must be valid'),
  
  body('fee')
    .optional()
    .isNumeric()
    .withMessage('Fee must be a number'),
  
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer')
];

// GET /api/events - Get all events with filtering and pagination
router.get('/', [
  query('type').optional().isIn(['coding', 'noncoding', 'nonanits', 'other']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('featured').optional().isBoolean(),
  query('active').optional().isBoolean(),
  query('collegeName').optional().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    console.log('Fetching events with query:', req.query);
    const {
      type,
      page = 1,
      limit = 20,
      featured,
      active,
      collegeName,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === 'true';
    // Only filter by isActive when explicitly passed
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    if (collegeName) filter.collegeName = new RegExp(collegeName, 'i');
    
    // Search functionality
    if (search) {
      filter.$or = [
        { eventName: new RegExp(search, 'i') },
        { eventDescription: new RegExp(search, 'i') },
        { collegeName: new RegExp(search, 'i') }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('Filter being used:', filter);
    
    // Determine which model(s) to query based on type
    let events = [];
    let totalEvents = 0;
    
    if (type) {
      // Query specific collection based on type
      const EventModel = getModelByType(type);
      console.log(`Querying ${EventModel.modelName} collection for type: ${type}`);
      
      // Remove type from filter since we're already querying the correct collection
      const { type: _, ...filterWithoutType } = filter;
      
      events = await EventModel.find(filterWithoutType)
        .sort({ createdAt: -1, featured: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      totalEvents = await EventModel.countDocuments(filterWithoutType);
    } else {
      // Query all collections if no type specified
      console.log('Querying all event collections');
      const [codingEvents, nonCodingEvents, nonAnitsEvents, otherEvents] = await Promise.all([
        CodingEvent.find(filter).sort({ createdAt: -1, featured: -1 }).lean(),
        NonCodingEvent.find(filter).sort({ createdAt: -1, featured: -1 }).lean(),
        NonAnitsEvent.find(filter).sort({ createdAt: -1, featured: -1 }).lean(),
        Event.find(filter).sort({ createdAt: -1, featured: -1 }).lean()
      ]);
      
      // Combine all events and sort them
      events = [...codingEvents, ...nonCodingEvents, ...nonAnitsEvents, ...otherEvents]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + parseInt(limit));
      
      const [codingCount, nonCodingCount, nonAnitsCount, otherCount] = await Promise.all([
        CodingEvent.countDocuments(filter),
        NonCodingEvent.countDocuments(filter),
        NonAnitsEvent.countDocuments(filter),
        Event.countDocuments(filter)
      ]);
      
      totalEvents = codingCount + nonCodingCount + nonAnitsCount + otherCount;
    }

    console.log('Found', events.length, 'events');
    console.log('Sample event (if any):', events[0]);

    // Get total count for pagination
    const totalPages = Math.ceil(totalEvents / parseInt(limit));
    
    console.log('Total events in DB matching filter:', totalEvents);

    // Format response for frontend compatibility
    const formattedEvents = events.map(event => ({
      id: event._id,
      title: event.eventName,
      description: event.eventDescription,
      image: event.image,
      alt: event.eventName,
      type: event.type,
      collegeName: event.collegeName,
      venue: event.venue,
      eventDate: event.eventDate,
      formattedDate: event.eventDate ? event.eventDate.toLocaleDateString() : null,
      startTime: event.startTime,
      endTime: event.endTime,
      registrationLink: event.registrationLink,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      fee: event.fee,
      participants: event.participants,
      maxParticipants: event.maxParticipants,
      uploader: event.uploader,
      featured: event.featured,
      createdAt: event.createdAt,
      tags: event.tags,
      prizes: event.prizes,
      organizers: event.organizers
    }));

    res.json({
      success: true,
      events: formattedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEvents,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/events - Create new event
router.post('/', upload.single('image'), eventValidation, handleValidationErrors, async (req, res) => {
  try {
    // The path to the uploaded image will be in req.file.path
    // We construct a URL that the frontend can use.
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    console.log('File uploaded:', req.file);

    const eventData = {
      eventName: req.body.eventName,
      eventDescription: req.body.eventDescription,
      type: req.body.type || 'other',
      uploader: req.body.uploader || 'User',
      collegeName: req.body.collegeName,
      venue: req.body.venue,
      eventDate: req.body.eventDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      registrationLink: req.body.registrationLink,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      image: imageUrl, // Save the URL path of the uploaded image
      fee: req.body.fee || 0,
      maxParticipants: req.body.maxParticipants,
      tags: req.body.tags || [],
      prizes: req.body.prizes || [],
      organizers: req.body.organizers || [],
      uploaderEmail: req.body.uploaderEmail,
      featured: req.body.featured || false
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: event._id,
        title: event.eventName,
        description: event.eventDescription,
        type: event.type,
        createdAt: event.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Legacy POST route for backward compatibility with frontend
// Add multer middleware to handle file uploads
router.post('/upload-event', upload.single('image'), (req, res, next) => {
  // Call the main creation logic
  createLegacyEvent(req, res, next);
});

async function createLegacyEvent(req, res) {
  try {
    console.log('Received legacy event data:', req.body, 'File:', req.file);
    if (!req.body.eventName || !req.body.eventDescription) {
      return res.status(400).json({
        success: false,
        message: 'Event name and description are required'
      });
    }
    
    // Get the image path from multer's req.file object, or use default from model
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined; // Let model set default

    const eventType = req.body.type || 'other';
    const eventData = {
      eventName: req.body.eventName,
      eventDescription: req.body.eventDescription,
      type: eventType,
      uploader: req.body.uploader || 'User',
      collegeName: req.body.collegeName,
      venue: req.body.venue,
      eventDate: req.body.eventDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      registrationLink: req.body.registrationLink,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      image: imageUrl, // Save the image path
      fee: req.body.fee || 0,
      maxParticipants: req.body.maxParticipants,
      tags: req.body.tags || [],
      prizes: req.body.prizes || [],
      organizers: req.body.organizers || [],
      uploaderEmail: req.body.uploaderEmail,
      featured: req.body.featured || false
    };

    // Get the correct model based on event type
    const EventModel = getModelByType(eventType);
    console.log(`Using model: ${EventModel.modelName} for type: ${eventType}`);
    
    const event = new EventModel(eventData);
    await event.save();

    res.json({
      success: true,
      message: 'Event uploaded successfully',
      event: {
        id: event._id,
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        type: event.type,
        createdAt: event.createdAt,
        uploader: event.uploader
      }
    });

  } catch (error) {
    console.error('Error uploading event:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
  try {
    // Try to find the event in all collections
    let event = await CodingEvent.findById(req.params.id).lean();
    if (!event) event = await NonCodingEvent.findById(req.params.id).lean();
    if (!event) event = await NonAnitsEvent.findById(req.params.id).lean();
    if (!event) event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Format response
    const formattedEvent = {
      id: event._id,
      title: event.eventName,
      description: event.eventDescription,
      image: event.image,
      type: event.type,
      collegeName: event.collegeName,
      venue: event.venue,
      eventDate: event.eventDate,
      formattedDate: event.eventDate ? event.eventDate.toLocaleDateString() : null,
      startTime: event.startTime,
      endTime: event.endTime,
      registrationLink: event.registrationLink,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      fee: event.fee,
      participants: event.participants,
      maxParticipants: event.maxParticipants,
      uploader: event.uploader,
      featured: event.featured,
      createdAt: event.createdAt,
      tags: event.tags,
      prizes: event.prizes,
      organizers: event.organizers
    };

    res.json({
      success: true,
      event: formattedEvent
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// PUT /api/events/:id - Update event
router.put('/:id', eventValidation, handleValidationErrors, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined && key !== '_id') {
        event[key] = req.body[key];
      }
    });

    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: {
        id: event._id,
        title: event.eventName,
        type: event.type,
        updatedAt: event.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

// GET /api/events/college/:collegeName - Get events by college
router.get('/college/:collegeName', async (req, res) => {
  try {
    const { collegeName } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const events = await Event.find({
      collegeName: new RegExp(collegeName, 'i'),
      isActive: true
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

    const totalEvents = await Event.countDocuments({
      collegeName: new RegExp(collegeName, 'i'),
      isActive: true
    });

    res.json({
      success: true,
      events: events.map(event => ({
        id: event._id,
        title: event.eventName,
        description: event.eventDescription,
        image: event.image,
        type: event.type,
        createdAt: event.createdAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / parseInt(limit)),
        totalEvents
      }
    });

  } catch (error) {
    console.error('Error fetching college events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch college events'
    });
  }
});

module.exports = router;
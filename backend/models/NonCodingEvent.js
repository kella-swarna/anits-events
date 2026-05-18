const mongoose = require('mongoose');

const nonCodingEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  eventDescription: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Event description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    default: 'noncoding',
    immutable: true
  },
  collegeName: {
    type: String,
    trim: true,
    maxlength: [100, 'College name cannot exceed 100 characters']
  },
  venue: {
    type: String,
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  eventDate: {
    type: Date,
    default: null
  },
  startTime: {
    type: String,
    trim: true
  },
  endTime: {
    type: String,
    trim: true
  },
  registrationLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Registration link must be a valid URL'
    }
  },
  contactEmail: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Contact email must be valid'
    }
  },
  contactPhone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\d\s\+\-\(\)]{10,15}$/.test(v);
      },
      message: 'Contact phone must be valid'
    }
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?fm=jpg&q=60&w=3000'
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploader: {
    type: String,
    required: [true, 'Uploader information is required'],
    enum: ['Admin', 'GoogleUser', 'User', 'Guest'],
    default: 'User'
  },
  uploaderEmail: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  participants: {
    type: Number,
    default: 0,
    min: 0
  },
  maxParticipants: {
    type: Number,
    default: null,
    min: 1
  },
  fee: {
    type: Number,
    default: 0,
    min: 0
  },
  prizes: [{
    position: String,
    amount: Number,
    description: String
  }],
  organizers: [{
    name: String,
    role: String,
    contact: String
  }]
}, {
  timestamps: true,
  collection: 'noncodingevents', // Explicitly set collection name
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
nonCodingEventSchema.index({ createdAt: -1 });
nonCodingEventSchema.index({ eventDate: 1 });
nonCodingEventSchema.index({ isActive: 1 });

// Virtual for formatted event date
nonCodingEventSchema.virtual('formattedDate').get(function() {
  if (!this.eventDate) return null;
  return this.eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for event status
nonCodingEventSchema.virtual('status').get(function() {
  if (!this.eventDate) return 'TBD';
  const now = new Date();
  const eventDate = new Date(this.eventDate);
  
  if (eventDate > now) return 'Upcoming';
  if (eventDate.toDateString() === now.toDateString()) return 'Today';
  return 'Past';
});

module.exports = mongoose.model('NonCodingEvent', nonCodingEventSchema);

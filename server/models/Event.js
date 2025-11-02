const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['event', 'task', 'appointment'],
    default: 'event'
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  color: {
    type: String,
    default: '#4285f4'
  },
  location: {
    type: String,
    default: ''
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  reminder: {
    type: Number,
    default: 0
  },
  // Task specific fields
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  // Appointment specific fields
  availability: {
    type: String,
    enum: ['available', 'unavailable', 'tentative'],
    default: 'available'
  },
  alternateSlots: [{
    startTime: Date,
    endTime: Date
  }]
}, {
  timestamps: true
});

// Index for efficient date queries
eventSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Event', eventSchema);
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { validateEvent, validateDateRange } = require('../middleware/validation');

// GET all events or events in date range
router.get('/', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate && endDate) {
      query = {
        $or: [
          // Events that start within the range
          {
            startTime: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          },
          // Events that end within the range
          {
            endTime: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          },
          // Events that span across the range
          {
            startTime: { $lte: new Date(startDate) },
            endTime: { $gte: new Date(endDate) }
          }
        ]
      };
    }
    
    const events = await Event.find(query).sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new event
router.post('/', validateEvent, async (req, res) => {
  try {
    const { title, description, startTime, endTime, color, location, isAllDay, reminder } = req.body;
    
    // Validation
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, start time, and end time are required' });
    }
    
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      color,
      location,
      isAllDay,
      reminder
    });
    
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update event
router.put('/:id', validateEvent, async (req, res) => {
  try {
    const { title, description, startTime, endTime, color, location, isAllDay, reminder } = req.body;
    
    // Validation
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        startTime,
        endTime,
        color,
        location,
        isAllDay,
        reminder
      },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const validateEvent = (req, res, next) => {
  const { title, startTime, endTime } = req.body;

  // Check required fields
  if (!title || !startTime || !endTime) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: {
        title: !title ? 'Title is required' : null,
        startTime: !startTime ? 'Start time is required' : null,
        endTime: !endTime ? 'End time is required' : null
      }
    });
  }

  // Validate date formats
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (startDate.toString() === 'Invalid Date') {
    return res.status(400).json({
      error: 'Invalid start time format'
    });
  }

  if (endDate.toString() === 'Invalid Date') {
    return res.status(400).json({
      error: 'Invalid end time format'
    });
  }

  // Check if end time is after start time
  if (startDate >= endDate) {
    return res.status(400).json({
      error: 'End time must be after start time'
    });
  }

  // Validate title length
  if (title.trim().length < 1 || title.trim().length > 100) {
    return res.status(400).json({
      error: 'Title must be between 1 and 100 characters'
    });
  }

  // Optional field validations
  if (req.body.color && !/^#[0-9A-Fa-f]{6}$/.test(req.body.color)) {
    return res.status(400).json({
      error: 'Invalid color format. Must be a valid hex color (e.g., #4285f4)'
    });
  }

  if (req.body.reminder && typeof req.body.reminder !== 'number') {
    return res.status(400).json({
      error: 'Reminder must be a number (minutes before event)'
    });
  }

  next();
};

const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if ((startDate && !endDate) || (!startDate && endDate)) {
    return res.status(400).json({
      error: 'Both startDate and endDate are required for date range filtering'
    });
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toString() === 'Invalid Date' || end.toString() === 'Invalid Date') {
      return res.status(400).json({
        error: 'Invalid date format in range parameters'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        error: 'End date must be after start date'
      });
    }
  }

  next();
};

module.exports = {
  validateEvent,
  validateDateRange
};
# Google Calendar Clone

A full-stack calendar application built with React.js, Node.js/Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Business Logic & Edge Cases](#business-logic--edge-cases)
- [Animations & Interactions](#animations--interactions)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

- Week view with 24-hour time slots
- Real-time current time indicator (red line)
- Create, edit, and delete events
- Different types of entries: Events, Tasks, and Appointments
- Click time slots to create entries instantly
- Mini calendar for date navigation
- Customizable event colors and reminders
- Dark theme UI matching Google Calendar

---

## 🛠 Tech Stack

**Frontend:** React.js, Tailwind CSS, Lucide React  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Why:** React for component reusability, MongoDB for flexible document storage, Tailwind for rapid UI development

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm

### Backend Setup

```bash
# Navigate to backend folder
cd server

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/Scaler-calendar
PORT=5000" > .env

# Start MongoDB
brew services start mongodb-community  # macOS
# OR
sudo systemctl start mongod  # Linux

# Run server
node server.js
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd client

# Install dependencies
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Configure tailwind.config.js
echo 'module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}' > tailwind.config.js

# Update src/index.css (add at top)
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# Start app
npm start
```

**Access:** Frontend at `http://localhost:3000`, Backend at `http://localhost:5000`

---

## 🏗 Architecture

### System Overview
```
React Frontend (Port 3000) ↔ Express API (Port 5000) ↔ MongoDB Database
```

### Frontend Structure
- **App.js**: Main component managing state
- **Header**: Navigation with Today/Week controls
- **Sidebar**: Create button + Mini calendar
- **WeekView**: 7-day grid with time slots
- **EventModal**: Create/Edit form with type switching
- **CurrentTimeLine**: Red line showing current time

### Backend Structure
- **server.js**: Express setup with CORS
- **models/Event.js**: Mongoose schema with type support
- **routes/events.js**: CRUD endpoints
- **middleware/validation.js**: Request validation
- **config/database.js**: MongoDB connection

### Data Flow
1. User clicks time slot → Modal opens with pre-filled time
2. User selects type (Event/Task/Appointment)
3. User fills type-specific form
4. POST request to `/api/events`
5. Backend validates & saves to MongoDB
6. Frontend refreshes and displays new entry

---

## 🧠 Business Logic & Edge Cases

### Entry Types & Validation

**Events:**
- Title, start time, end time required
- Location and reminder optional
- Standard calendar event format

**Tasks:**
- Title and deadline required
- Status tracking (pending/in-progress/completed)
- Task-specific details

**Appointments:**
- Title, start time, end time required
- Availability status (available/unavailable/tentative)
- Alternative time slots when unavailable

### Edge Cases Handled

1. **Time Validation**
   ```javascript
   if (startTime >= endTime) {
     throw new Error('End time must be after start time');
   }
   ```

2. **Type-Specific Validation**
   - Tasks require deadline
   - Appointments require alternative slots when unavailable
   - All types require basic fields

4. **Current Time Indicator**
   - Position: `(hours * 60 + minutes) / 60 * 60px`
   - Updates every 60 seconds
   - Only shows on today's column

---

## 🎨 Animations & Interactions

### Current Time Line
```javascript
useEffect(() => {
  const updatePosition = () => {
    const now = new Date();
    setPosition((now.getHours() * 60 + now.getMinutes()) / 60);
  };
  updatePosition();
  const interval = setInterval(updatePosition, 60000);
  return () => clearInterval(interval);
}, []);
```

### Modal Interactions
- Type switching with specialized forms
- Pre-fills time based on clicked slot
- Validation feedback for required fields
- Smooth transitions between form types

---

## 📚 API Endpoints

**Base URL:** `http://localhost:5000/api`

### GET /events
Fetch all events (optional date range filtering)

**Query Params:** `startDate`, `endDate` (ISO 8601)

**Response:**
```json
[{
  "_id": "507f...",
  "title": "Team Meeting",
  "type": "event",
  "startTime": "2025-11-03T10:00:00.000Z",
  "endTime": "2025-11-03T11:00:00.000Z",
  "color": "#4285f4",
  "location": "Room A",
  "reminder": 30
}]
```

### POST /events
Create new entry (event/task/appointment)

**Body:**
```json
{
  "title": "Meeting",
  "type": "event",
  "startTime": "2025-11-03T10:00:00.000Z",
  "endTime": "2025-11-03T11:00:00.000Z",
  "description": "Optional",
  "location": "Optional",
  "color": "#4285f4",
  "reminder": 30
}
```

---

## 🔮 Future Enhancements

1. **Calendar Views**
   - Day, Month, Year views
   - Agenda view
   - List view for tasks

2. **Advanced Features**
   - Recurring events
   - Drag & drop
   - Event resize
   - Conflict detection

3. **Collaboration**
   - Share calendars
   - Team scheduling
   - Event invitations

4. **Integrations**
   - External calendar sync
   - Meeting platform integration
   - Email notifications

---

**Built with ❤️ using React, Node.js, and MongoDB**
import React, { useState, useEffect } from 'react';
import { Menu, Search, HelpCircle, Settings, Grid3x3, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, AlignLeft, Bell } from 'lucide-react';

// API Service
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  getEvents: async (startDate, endDate) => {
    const url = startDate && endDate 
      ? `${API_BASE_URL}/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      : `${API_BASE_URL}/events`;
    const response = await fetch(url);
    return response.json();
  },
  
  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Date Utilities
const dateUtils = {
  getWeekDays: (date) => {
    const curr = new Date(date);
    const week = [];
    
    curr.setDate(curr.getDate() - curr.getDay());
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    
    return week;
  },
  
  formatDate: (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  },
  
  formatTime: (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  },
  
  isSameDay: (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  },
  
  getTimePosition: (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return hours + (minutes / 60);
  }
};

// Current Time Line Component
// const CurrentTimeLine = () => {
//   const [position, setPosition] = useState(0);
  
//   useEffect(() => {
//     const updatePosition = () => {
//       const now = new Date();
//       setPosition(dateUtils.getTimePosition(now));
//     };
    
//     updatePosition();
//     const interval = setInterval(updatePosition, 60000);
    
//     return () => clearInterval(interval);
//   }, []);
  
//   return (
//     <div
//       className="absolute left-0 right-0 z-20 pointer-events-none"
//       style={{ top: `${position * 16}px` }}
//     >
//       <div className="flex items-center">
//         <div className="w-3 h-3 rounded-full bg-red-500"></div>
//         <div className="flex-1 h-0.5 bg-red-500"></div>
//       </div>
//     </div>
//   );
// };

const CurrentTimeLine = () => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      setPosition(dateUtils.getTimePosition(now));
    };
    
    updatePosition();
    const interval = setInterval(updatePosition, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div
  className="absolute left-0 right-0 z-20 pointer-events-none"
  style={{ top: `${position * 64}px` }}
>
  <div className="flex items-center">
    <div className="w-3 h-3 rounded-full bg-red-500"></div>
    <div className="flex-1 h-0.5 bg-red-500"></div>
  </div>
</div>
  );
};


// Event Block Component
const EventBlock = ({ event, onClick }) => {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  
  const startPos = dateUtils.getTimePosition(startDate);
  const duration = (endDate - startDate) / (1000 * 60 * 60);
  const height = duration * 60;
  
  return (
    <div
      onClick={() => onClick(event)}
      className="absolute left-1 right-1 rounded px-2 py-1 cursor-pointer hover:opacity-80 overflow-hidden"
      style={{
        top: `${startPos * 60}px`,
        height: `${height}px`,
        backgroundColor: event.color || '#4285f4',
        minHeight: '20px'
      }}
    >
      <div className="text-white text-xs font-medium truncate">{event.title}</div>
      <div className="text-white text-xs opacity-90">
        {dateUtils.formatTime(startDate)}
      </div>
    </div>
  );
};

// Event Modal Component
const TaskForm = ({ formData, setFormData, selectedDate, selectedTime }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Clock className="text-gray-400" size={20} />
        <div className="flex-1">
          <div className="text-gray-400">Due by</div>
          <input
            type="datetime-local"
            value={formData.deadline || formData.endTime}
            onChange={(e) => setFormData({
              ...formData,
              deadline: e.target.value,
              endTime: e.target.value
            })}
            className="bg-gray-700 text-white px-3 py-2 rounded w-full mt-1"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <AlignLeft className="text-gray-400" size={20} />
        <textarea
          placeholder="Task details"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="flex-1 bg-gray-700 text-white p-3 rounded resize-none outline-none"
          rows="3"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-400">Status:</div>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="bg-gray-700 text-white px-3 py-2 rounded outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

const AppointmentForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Clock className="text-gray-400" size={20} />
        <div className="flex-1">
          <div className="flex gap-4 items-center">
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            />
            <span className="text-gray-400">to</span>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-400">Availability:</div>
        <select
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="bg-gray-700 text-white px-3 py-2 rounded outline-none"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="tentative">Tentative</option>
        </select>
      </div>

      {formData.availability !== 'available' && (
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Clock className="text-gray-400" size={20} />
            <div className="text-gray-400">Alternative Slots</div>
            <button
              onClick={() => {
                const newSlots = [...(formData.alternateSlots || []), { startTime: '', endTime: '' }];
                setFormData({ ...formData, alternateSlots: newSlots });
              }}
              className="ml-auto text-blue-500 hover:text-blue-400"
            >
              Add Slot
            </button>
          </div>
          {formData.alternateSlots?.map((slot, index) => (
            <div key={index} className="flex gap-4 items-center mb-2 ml-8">
              <input
                type="datetime-local"
                value={slot.startTime}
                onChange={(e) => {
                  const newSlots = [...(formData.alternateSlots || [])];
                  newSlots[index] = { ...slot, startTime: e.target.value };
                  setFormData({ ...formData, alternateSlots: newSlots });
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              />
              <span className="text-gray-400">to</span>
              <input
                type="datetime-local"
                value={slot.endTime}
                onChange={(e) => {
                  const newSlots = [...(formData.alternateSlots || [])];
                  newSlots[index] = { ...slot, endTime: e.target.value };
                  setFormData({ ...formData, alternateSlots: newSlots });
                }}
                className="bg-gray-700 text-white px-3 py-2 rounded"
              />
              <button
                onClick={() => {
                  const newSlots = formData.alternateSlots.filter((_, i) => i !== index);
                  setFormData({ ...formData, alternateSlots: newSlots });
                }}
                className="text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EventForm = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Clock className="text-gray-400" size={20} />
        <div className="flex-1">
          <div className="flex gap-4 items-center">
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            />
            <span className="text-gray-400">to</span>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="bg-gray-700 text-white px-3 py-2 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <MapPin className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Add location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="flex-1 bg-transparent text-white border-b border-gray-600 pb-2 outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <AlignLeft className="text-gray-400" size={20} />
        <textarea
          placeholder="Add description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="flex-1 bg-gray-700 text-white p-3 rounded resize-none outline-none"
          rows="3"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-400" size={20} />
        <select
          value={formData.reminder}
          onChange={(e) => setFormData({ ...formData, reminder: parseInt(e.target.value) })}
          className="bg-gray-700 text-white px-3 py-2 rounded outline-none"
        >
          <option value="0">No reminder</option>
          <option value="15">15 minutes before</option>
          <option value="30">30 minutes before</option>
          <option value="60">1 hour before</option>
        </select>
      </div>
    </div>
  );
};

const EventModal = ({ isOpen, onClose, onSave, selectedDate, selectedTime, editEvent }) => {
  const [modalType, setModalType] = useState(editEvent?.type || 'event');
  const [formData, setFormData] = useState({
    title: '',
    type: 'event',
    description: '',
    startTime: '',
    endTime: '',
    color: '#4285f4',
    location: '',
    isAllDay: false,
    reminder: 0,
    status: 'pending',
    availability: 'available',
    alternateSlots: [],
    deadline: ''
  });
  
  useEffect(() => {
    if (editEvent) {
      setFormData({
        ...editEvent,
        startTime: new Date(editEvent.startTime).toISOString().slice(0, 16),
        endTime: new Date(editEvent.endTime).toISOString().slice(0, 16),
        deadline: editEvent.deadline ? new Date(editEvent.deadline).toISOString().slice(0, 16) : '',
        alternateSlots: editEvent.alternateSlots?.map(slot => ({
          startTime: new Date(slot.startTime).toISOString().slice(0, 16),
          endTime: new Date(slot.endTime).toISOString().slice(0, 16)
        })) || []
      });
      setModalType(editEvent.type || 'event');
    }
  }, [editEvent]);
  
  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      // Validate required dates based on type
      if (!formData.startTime || !formData.endTime) {
        alert('Please fill in all required time fields');
        return;
      }

      const eventData = {
        ...formData,
        type: modalType
      };

      // Add type-specific fields
      if (modalType === 'task') {
        if (!formData.deadline) {
          alert('Please set a deadline for the task');
          return;
        }
        eventData.deadline = formData.deadline;
      }

      if (modalType === 'appointment') {
        if (formData.availability !== 'available' && (!formData.alternateSlots || formData.alternateSlots.length === 0)) {
          alert('Please add alternative time slots when not available');
          return;
        }
        // Filter out any incomplete alternate slots
        eventData.alternateSlots = formData.alternateSlots
          ?.filter(slot => slot.startTime && slot.endTime)
          .map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime
          })) || [];
      }

      onSave(eventData, editEvent?._id);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please check all fields are filled correctly.');
    }
  };

  const renderForm = () => {
    switch (modalType) {
      case 'task':
        return <TaskForm formData={formData} setFormData={setFormData} selectedDate={selectedDate} selectedTime={selectedTime} />;
      case 'appointment':
        return <AppointmentForm formData={formData} setFormData={setFormData} />;
      default:
        return <EventForm formData={formData} setFormData={setFormData} />;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="w-8"></div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <input
            type="text"
            placeholder="Add title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-transparent text-white text-2xl border-b-2 border-blue-500 pb-2 mb-4 outline-none"
          />
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                const start = new Date(selectedDate || new Date());
                start.setHours(selectedTime || new Date().getHours(), 0, 0, 0);
                const end = new Date(start);
                end.setHours(start.getHours() + 1, 0, 0, 0);
                
                setModalType('event');
                setFormData(prev => ({
                  ...prev,
                  type: 'event',
                  startTime: start.toISOString().slice(0, 16),
                  endTime: end.toISOString().slice(0, 16)
                }));
              }}
              className={`px-4 py-2 rounded ${modalType === 'event' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Event
            </button>
            <button
              onClick={() => {
                const deadline = new Date(selectedDate || new Date());
                deadline.setHours(selectedTime || new Date().getHours(), 0, 0, 0);
                
                setModalType('task');
                setFormData(prev => ({
                  ...prev,
                  type: 'task',
                  status: 'pending',
                  startTime: deadline.toISOString().slice(0, 16),
                  endTime: deadline.toISOString().slice(0, 16),
                  deadline: deadline.toISOString().slice(0, 16)
                }));
              }}
              className={`px-4 py-2 rounded ${modalType === 'task' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Task
            </button>
            <button
              onClick={() => {
                const start = new Date(selectedDate || new Date());
                start.setHours(selectedTime || new Date().getHours(), 0, 0, 0);
                const end = new Date(start);
                end.setHours(start.getHours() + 1, 0, 0, 0);
                
                setModalType('appointment');
                setFormData(prev => ({
                  ...prev,
                  type: 'appointment',
                  availability: 'available',
                  alternateSlots: [],
                  startTime: start.toISOString().slice(0, 16),
                  endTime: end.toISOString().slice(0, 16)
                }));
              }}
              className={`px-4 py-2 rounded ${modalType === 'appointment' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Appointment schedule
            </button>
          </div>
          
          {renderForm()}
          
          <div className="flex items-center gap-4 mt-4">
            <div className="text-gray-400 text-sm">Color:</div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            {editEvent && (
              <button
                onClick={() => onSave(null, editEvent._id, true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mini Calendar Component
const MiniCalendar = ({ currentDate, onDateChange }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const isToday = dateUtils.isSameDay(date, new Date());
    const isSelected = dateUtils.isSameDay(date, currentDate);
    
    days.push(
      <button
        key={day}
        onClick={() => onDateChange(date)}
        className={`h-8 flex items-center justify-center text-sm rounded-full hover:bg-gray-700 ${
          isToday ? 'bg-blue-600 text-white' : ''
        } ${isSelected && !isToday ? 'bg-gray-700' : ''}`}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-medium">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  
  const weekDays = dateUtils.getWeekDays(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  useEffect(() => {
    loadEvents();
  }, [currentDate]);
  
  const loadEvents = async () => {
    try {
      const weekStart = weekDays[0];
      const weekEnd = new Date(weekDays[6]);
      weekEnd.setHours(23, 59, 59);
      
      const data = await api.getEvents(weekStart, weekEnd);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };
  
  const handleSaveEvent = async (eventData, eventId) => {
    try {
      if (eventId) {
        await api.updateEvent(eventId, eventData);
      } else {
        await api.createEvent(eventData);
      }
      loadEvents();
      setEditEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.deleteEvent(eventId);
      loadEvents();
      setIsModalOpen(false);
      setEditEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };
  
  const handleTimeSlotClick = (date, hour) => {
    setSelectedDate(date);
    setSelectedTime(hour);
    setEditEvent(null);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (event) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };
  
  const handleCreateClick = () => {
    setSelectedDate(new Date());
    setSelectedTime(new Date().getHours());
    setEditEvent(null);
    setIsModalOpen(true);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-700 rounded">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-normal">Calendar</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={goToToday} className="px-4 py-2 hover:bg-gray-700 rounded">
            Today
          </button>
          <div className="flex items-center gap-2">
            <button onClick={goToPrevWeek} className="p-2 hover:bg-gray-700 rounded">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goToNextWeek} className="p-2 hover:bg-gray-700 rounded">
              <ChevronRight size={20} />
            </button>
          </div>
          <span className="text-xl">{dateUtils.formatDate(currentDate)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-700 rounded">
            <Search size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded">
            <Grid3x3 size={20} />
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <button
            onClick={handleCreateClick}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-full flex items-center gap-2 mb-6"
          >
            <Plus size={20} />
            <span>Create</span>
          </button>
          
          <MiniCalendar currentDate={currentDate} onDateChange={setCurrentDate} />
          
          <div className="mt-6">
            <div className="text-sm text-gray-400 mb-2">My calendars</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded" />
                <span>Events</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Week Header */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="flex">
              <div className="w-20"></div>
              {weekDays.map((day, index) => {
                const isToday = dateUtils.isSameDay(day, new Date());
                return (
                  <div key={index} className="flex-1 text-center py-2 border-l border-gray-700">
                    <div className="text-xs text-gray-400">
                      {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </div>
                    <div className={`text-2xl mt-1 ${isToday ? 'bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto' : ''}`}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Time Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex">
              {/* Time Labels */}
              <div className="w-20 flex-shrink-0">
                {hours.map(hour => (
                  <div key={hour} className="h-16 flex items-start justify-end pr-2 text-xs text-gray-400 -mt-2">
                    {hour === 0 ? '' : `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`}
                  </div>
                ))}
              </div>
              
              {/* Days Grid */}
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="flex-1 border-l border-gray-700 relative">
                  {hours.map(hour => (
                    <div
                      key={hour}
                      onClick={() => handleTimeSlotClick(day, hour)}
                      className="h-16 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                    ></div>
                  ))}
                  
                  {/* Events for this day */}
                  {events
                    .filter(event => dateUtils.isSameDay(new Date(event.startTime), day))
                    .map(event => (
                      <EventBlock key={event._id} event={event} onClick={handleEventClick} />
                    ))
                  }
                  
                  {/* Current time line */}
                  {dateUtils.isSameDay(day, new Date()) && <CurrentTimeLine />}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditEvent(null);
        }}
        onSave={(eventData, eventId, isDelete) => {
          if (isDelete) {
            handleDeleteEvent(eventId);
          } else {
            handleSaveEvent(eventData, eventId);
          }
        }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        editEvent={editEvent}
      />
    </div>
  );
}
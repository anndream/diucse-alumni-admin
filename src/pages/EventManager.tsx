import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

// Define the EventItem type based on your schema for the frontend
type EventItem = {
  id: number;
  name: string;
  startAt: string; // Storing as string for datetime-local input
  endAt: string;   // Storing as string for datetime-local input
  location: string;
  mapUrl: string;
  isOnline: boolean;
  onlineUrl: string;
  fee: number;
  registrationStartDate: string; // Storing as string for datetime-local input
  registrationEndDate: string;   // Storing as string for datetime-local input
  poster: string | null; // Storing base64 image URL
};

const EventManager: React.FC = () => {
  const [eventList, setEventList] = useState<EventItem[]>([]);
  // Initialize currentEvent with default values including an empty string for dates
  const [currentEvent, setCurrentEvent] = useState<Partial<EventItem>>({
    name: '',
    startAt: '',
    endAt: '',
    location: '',
    mapUrl: '',
    isOnline: false,
    onlineUrl: '',
    fee: 0,
    registrationStartDate: '',
    registrationEndDate: '',
    poster: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Handle image drop for poster
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const image = acceptedFiles[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentEvent(prev => ({ ...prev, poster: reader.result as string }));
      };
      reader.readAsDataURL(image);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp', '.jpg'] },
    multiple: false,
  });

  // Handle input changes for text and number fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // For number inputs, convert value to a number
    const newValue = type === 'number' ? parseFloat(value) : value;
    setCurrentEvent(prev => ({ ...prev, [name]: newValue }));
  };

  // Handle checkbox change for isOnline
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: checked }));
  };

  // Handle adding or updating an event
  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent.name || !currentEvent.startAt || !currentEvent.endAt) {
      console.error("Name, Start Date, and End Date are required.");
      return;
    }

    if (isEditing && currentEvent.id !== undefined) {
      setEventList(prev =>
        prev.map(event => (event.id === currentEvent.id ? { ...event, ...currentEvent } : event))
      );
      setIsEditing(false);
    } else {
      const newEvent: EventItem = {
        id: Date.now(), // Unique ID for client-side management
        name: currentEvent.name!,
        startAt: currentEvent.startAt!,
        endAt: currentEvent.endAt!,
        location: currentEvent.location || '',
        mapUrl: currentEvent.mapUrl || '',
        isOnline: currentEvent.isOnline || false,
        onlineUrl: currentEvent.onlineUrl || '',
        fee: currentEvent.fee || 0,
        registrationStartDate: currentEvent.registrationStartDate || '',
        registrationEndDate: currentEvent.registrationEndDate || '',
        poster: currentEvent.poster || null,
      };
      setEventList(prev => [...prev, newEvent]);
    }

    // Reset form
    setCurrentEvent({
      name: '',
      startAt: '',
      endAt: '',
      location: '',
      mapUrl: '',
      isOnline: false,
      onlineUrl: '',
      fee: 0,
      registrationStartDate: '',
      registrationEndDate: '',
      poster: null,
    });
    setShowForm(false);
  };

  // Set form for editing
  const handleEdit = (event: EventItem) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setShowForm(true);
  };

  // Delete an event
  const handleDelete = (id: number) => {
    setEventList(prev => prev.filter(event => event.id !== id));
  };

  // Cancel edit/add and hide form
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEvent({
      name: '',
      startAt: '',
      endAt: '',
      location: '',
      mapUrl: '',
      isOnline: false,
      onlineUrl: '',
      fee: 0,
      registrationStartDate: '',
      registrationEndDate: '',
      poster: null,
    });
    setShowForm(false);
  };

  // Helper to format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString(); // Uses user's locale for date and time
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString; // Return original string if formatting fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white text-center">
          <h1 className="text-4xl font-extrabold mb-2">Event Dashboard</h1>
          <p className="text-purple-200 text-lg">Manage your upcoming events</p>
        </div>

        {!showForm && (
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setCurrentEvent({ // Reset current event for new entry
                  name: '',
                  startAt: '',
                  endAt: '',
                  location: '',
                  mapUrl: '',
                  isOnline: false,
                  onlineUrl: '',
                  fee: 0,
                  registrationStartDate: '',
                  registrationEndDate: '',
                  poster: null,
                });
                setIsEditing(false);
                setShowForm(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition-all duration-200 mb-10"
            >
              + Create New Event
            </button>
          </div>
        )}

        {showForm && (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <form onSubmit={handleAddOrUpdate} className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
                <input
                  name="name"
                  type="text"
                  value={currentEvent.name || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Start At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date & Time</label>
                <input
                  name="startAt"
                  type="datetime-local"
                  value={currentEvent.startAt || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* End At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date & Time</label>
                <input
                  name="endAt"
                  type="datetime-local"
                  value={currentEvent.endAt || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  name="location"
                  type="text"
                  value={currentEvent.location || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Conference Hall A"
                />
              </div>

              {/* Map URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Map URL</label>
                <input
                  name="mapUrl"
                  type="url"
                  value={currentEvent.mapUrl || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., https://maps.google.com/..."
                />
              </div>

              {/* Is Online */}
              <div className="flex items-center">
                <input
                  name="isOnline"
                  type="checkbox"
                  checked={currentEvent.isOnline || false}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <label className="ml-2 block text-sm font-semibold text-gray-700">Online Event</label>
              </div>

              {/* Online URL (conditionally rendered) */}
              {currentEvent.isOnline && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Online URL</label>
                  <input
                    name="onlineUrl"
                    type="url"
                    value={currentEvent.onlineUrl || ''}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., https://zoom.us/j/..."
                  />
                </div>
              )}

              {/* Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fee ($)</label>
                <input
                  name="fee"
                  type="number"
                  value={currentEvent.fee || 0}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Registration Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Start Date</label>
                <input
                  name="registrationStartDate"
                  type="datetime-local"
                  value={currentEvent.registrationStartDate || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Registration End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Registration End Date</label>
                <input
                  name="registrationEndDate"
                  type="datetime-local"
                  value={currentEvent.registrationEndDate || ''}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Poster Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Poster</label>
                <div
                  {...getRootProps()}
                  className={`p-6 border-2 ${
                    isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
                  } border-dashed rounded-lg text-center cursor-pointer`}
                >
                  <input {...getInputProps()} />
                  {currentEvent.poster ? (
                    <p className="text-purple-600">Poster selected! Drag a new one or click to change.</p>
                  ) : (
                    <p className="text-gray-600">Drag 'n' drop a poster image here, or click to select one</p>
                  )}
                </div>
                {currentEvent.poster && (
                  <div className="mt-4 text-center">
                    <img
                      src={currentEvent.poster}
                      alt="Poster Preview"
                      className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200/cccccc/333333?text=Image+Load+Error"; }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  {isEditing ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-8 bg-gray-50 border-t">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Published Events</h3>
          {eventList.length === 0 ? (
            <p className="text-center text-gray-500">No events published yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {eventList.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-xl shadow-md border">
                  {event.poster && (
                    <img src={event.poster} alt={event.name} className="mb-4 w-full h-48 object-cover rounded" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200/cccccc/333333?text=Image+Load+Error"; }} />
                  )}
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Start:</span> {formatDateForDisplay(event.startAt)}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">End:</span> {formatDateForDisplay(event.endAt)}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Location:</span> {event.isOnline ? 'Online' : event.location || 'N/A'}
                  </p>
                  {event.isOnline && event.onlineUrl && (
                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-semibold">URL:</span> <a href={event.onlineUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{event.onlineUrl}</a>
                    </p>
                  )}
                  {event.mapUrl && !event.isOnline && (
                    <p className="text-gray-700 text-sm mb-2">
                      <span className="font-semibold">Map:</span> <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{event.mapUrl}</a>
                    </p>
                  )}
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Fee:</span> ${event.fee !== undefined ? event.fee.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-semibold">Registration:</span> {formatDateForDisplay(event.registrationStartDate)} - {formatDateForDisplay(event.registrationEndDate)}
                  </p>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => handleEdit(event)} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManager;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import EventCard from "../components/events/EventCard";
import EventForm from "../components/events/EventForm";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../utils/api";
import { Event } from "../types";
import { toast } from "react-hot-toast";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useAuth } from "../context/AuthContext";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (formData: FormData) => {
    try {
      await createEvent(formData);
      await fetchEvents();
      toast.success("Event created successfully");
      setShowEventForm(false);
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleUpdateEvent = async (formData: FormData) => {
    if (!selectedEvent) return;
    try {
      await updateEvent(selectedEvent._id, formData);
      await fetchEvents();
      toast.success("Event updated successfully");
      setSelectedEvent(null);
      setShowEventForm(false);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        await fetchEvents();
        toast.success("Event deleted successfully");
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  if (loading) {
    return <LoadingOverlay message="Loading events..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {isAdmin && (
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </button>
          )}
        </div>

        {error ? (
          <div className="text-center text-red-600 py-12">
            <p>{error}</p>
            <button
              onClick={() => fetchEvents()}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600">
              {isAdmin
                ? "Click the 'Add Event' button to create your first event."
                : "Check back later for upcoming events."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAdmin={isAdmin}
                onEdit={() => {
                  setSelectedEvent(event);
                  setShowEventForm(true);
                }}
                onDelete={() => handleDeleteEvent(event._id)}
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {showEventForm && (
            <EventForm
              event={selectedEvent}
              onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
              onClose={() => {
                setShowEventForm(false);
                setSelectedEvent(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;

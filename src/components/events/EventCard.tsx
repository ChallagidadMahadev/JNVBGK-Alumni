import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isPast } from "date-fns";
import { MapPin, Calendar, Users, Edit, Trash2 } from "lucide-react";
import { Event } from "../../types";
import EventCountdown from "./EventCountdown";
import ParticipationModal from "./ParticipationModal";
import { useAuth } from "../../context/AuthContext";
import { registerForEvent } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onParticipationUpdate?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isAdmin = false,
  onEdit,
  onDelete,
  onParticipationUpdate,
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRegisteredUsers, setLocalRegisteredUsers] = useState(
    event.registeredUsers
  );

  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      return format(date, "PPP");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  const handleParticipationConfirm = async (attending: boolean) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedEvent = await registerForEvent(event._id, attending);
      setLocalRegisteredUsers(updatedEvent.registeredUsers);
      toast.success(
        attending
          ? "🎉 Successfully registered for the event!"
          : "👋 Response recorded. Maybe next time!"
      );
      onParticipationUpdate?.();
      setShowParticipationModal(false);
    } catch (error) {
      toast.error("Failed to update participation status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to register for events");
      navigate("/login");
      return;
    }
    setShowParticipationModal(true);
  };

  const isRegistered = user && localRegisteredUsers.includes(user._id);
  const isEventCompleted = isPast(new Date(event.endDate));

  const getEventStatus = () => {
    if (isEventCompleted) {
      return isRegistered
        ? { text: "✨ You attended this event", className: "text-green-600" }
        : { text: "💔 You missed this event", className: "text-red-600" };
    }
    return isRegistered
      ? { text: "✓ You're attending", className: "text-green-600" }
      : { text: "○ Not registered", className: "text-gray-500" };
  };

  const status = getEventStatus();

  const getButtonConfig = () => {
    if (isEventCompleted) {
      return null; // No button for completed events
    }

    if (isRegistered) {
      return {
        text: "Update Response",
        className: "bg-green-600 hover:bg-green-700",
      };
    }

    return {
      text: "Register Now",
      className: "bg-blue-600 hover:bg-blue-700",
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-md overflow-hidden relative"
      >
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          }
          alt={event.title}
          className="w-full h-48 object-cover"
        />

        <div className="absolute top-4 right-4 space-x-2">
          <EventCountdown eventDate={event.startDate} />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4">{event.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate !== event.startDate && (
                <>
                  <span className="mx-2">-</span>
                  <span>{formatDate(event.endDate)}</span>
                </>
              )}
            </div>

            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>{localRegisteredUsers.length} registered</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${status.className}`}>
              {status.text}
            </div>

            {buttonConfig && (
              <button
                onClick={handleRegisterClick}
                className={`text-white py-2 px-4 rounded-md transition duration-300 ${buttonConfig.className}`}
              >
                {buttonConfig.text}
              </button>
            )}
          </div>

          {isAdmin && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onEdit?.(event)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete?.(event._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {showParticipationModal && (
        <ParticipationModal
          event={event}
          isOpen={showParticipationModal}
          onClose={() => setShowParticipationModal(false)}
          onConfirm={handleParticipationConfirm}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default EventCard;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isPast,
} from "date-fns";

interface EventCountdownProps {
  eventDate: string | Date;
  className?: string;
}

const EventCountdown: React.FC<EventCountdownProps> = ({
  eventDate,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        const now = new Date();
        const eventDateTime = new Date(eventDate);

        if (isPast(eventDateTime)) {
          return { days: 0, hours: 0, minutes: 0 };
        }

        return {
          days: differenceInDays(eventDateTime, now),
          hours: differenceInHours(eventDateTime, now) % 24,
          minutes: differenceInMinutes(eventDateTime, now) % 60,
        };
      } catch (error) {
        console.error("Invalid date:", eventDate);
        return { days: 0, hours: 0, minutes: 0 };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000 * 60); // Update every minute

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [eventDate]);

  let eventDateTime: Date;
  try {
    eventDateTime = new Date(eventDate);
  } catch (error) {
    return null;
  }

  const isCompleted = isPast(eventDateTime);
  const isUpcoming = timeLeft.days <= 7 && !isCompleted;

  return (
    <motion.div
      className={`flex flex-col items-center bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm rounded-lg p-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isCompleted ? (
        <span className="text-white font-medium px-3 py-1 rounded-full bg-gray-600">
          Event Completed
        </span>
      ) : (
        <>
          <div className="flex space-x-4 mb-2">
            <TimeUnit value={timeLeft.days} unit="days" />
            <TimeUnit value={timeLeft.hours} unit="hours" />
            <TimeUnit value={timeLeft.minutes} unit="min" />
          </div>
          {isUpcoming && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-white font-medium text-sm bg-blue-600 px-3 py-1 rounded-full"
            >
              Hurry up! Limited spots available
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

const TimeUnit: React.FC<{ value: number; unit: string }> = ({
  value,
  unit,
}) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-gray-200">{unit}</span>
  </div>
);

export default EventCountdown;

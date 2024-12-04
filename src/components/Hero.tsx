import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="min-h-screen pt-16 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to JNV Alumni Network
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connecting Navodayan graduates across generations. Join our vibrant
            community to network, share experiences, and stay updated with
            latest events.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition duration-300"
          >
            Join Network
          </button>
          <button
            onClick={() => navigate("/events")}
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transform hover:scale-105 transition duration-300"
          >
            Explore Events
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <StatsCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="5000+"
            description="Active Alumni Members"
          />
          <StatsCard
            icon={<Calendar className="w-8 h-8 text-blue-600" />}
            title="50+"
            description="Annual Events"
          />
          <StatsCard
            icon={<BookOpen className="w-8 h-8 text-blue-600" />}
            title="100+"
            description="Success Stories"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg text-center"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default Hero;

import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";
import { News } from "../models/News.js";

export const initializeDatabase = async () => {
  try {
    // Create admin user if not exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      const admin = new User({
        name: "Admin User",
        email: "admin@jnv.com",
        password: hashedPassword,
        batchYear: 2000,
        role: "admin",
      });
      await admin.save();
      console.log("Admin user created successfully");
    }

    // Create sample events if none exist
    const eventsExist = await Event.countDocuments();
    if (!eventsExist) {
      const admin = await User.findOne({ role: "admin" });
      const events = [
        {
          title: "Annual Alumni Meet 2024",
          description:
            "Join us for our annual alumni gathering with networking opportunities and cultural events.",
          date: new Date("2024-12-15"),
          location: "JNV Campus",
          createdBy: admin._id,
          registeredUsers: [],
        },
        {
          title: "Career Guidance Workshop",
          description:
            "Expert alumni sharing insights about various career paths and opportunities.",
          date: new Date("2024-08-20"),
          location: "Virtual Event",
          createdBy: admin._id,
          registeredUsers: [],
        },
      ];

      await Event.insertMany(events);
      console.log("Sample events created successfully");
    }

    // Create sample news if none exist
    const newsExist = await News.countDocuments();
    if (!newsExist) {
      const admin = await User.findOne({ role: "admin" });
      const news = [
        {
          title: "New Campus Building Inauguration",
          content:
            "The new academic block will be inaugurated next month, expanding our facilities.",
          category: "announcement",
          author: admin._id,
        },
        {
          title: "Alumni Achievement: Dr. Sharma receives National Award",
          content:
            "Our distinguished alumni Dr. Sharma has been awarded for contributions to medical research.",
          category: "achievement",
          author: admin._id,
        },
      ];

      await News.insertMany(news);
      console.log("Sample news created successfully");
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

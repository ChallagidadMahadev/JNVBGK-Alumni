import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  batchYear: {
    type: Number,
    required: [true, 'Batch year is required'],
    min: [1980, 'Batch year must be 1980 or later'],
    max: [new Date().getFullYear(), 'Batch year cannot be in the future']
  },
  phoneNumber: String,
  address: String,
  profilePicture: String,
  role: {
    type: String,
    enum: ['alumni', 'admin'],
    default: 'alumni'
  },
  showPhoneNumber: {
    type: Boolean,
    default: false
  },
  
  occupationPrefix: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model('User', userSchema);
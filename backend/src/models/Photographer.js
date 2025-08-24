const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const photographerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true
  },
  specialization: {
    type: [String],
    enum: ['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'videography'],
    required: [true, 'Please select at least one specialization']
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    category: {
      type: String,
      enum: ['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'videography']
    }
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      min: 0
    },
    dayRate: {
      type: Number,
      min: 0
    },
    packages: [{
      name: String,
      description: String,
      price: Number,
      duration: String,
      includes: [String]
    }]
  },
  availability: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: String, // "09:00"
      end: String    // "18:00"
    },
    blockedDates: [Date]
  },
  equipment: [String],
  experience: {
    type: Number,
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});


// 🔹 Hash password before saving
photographerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare password
photographerSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Generate Access Token
photographerSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        id: this._id,
        role: 'photographer', // 👈 fixed role for photographers
        isActive: this.isActive
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
  } catch (error) {
    return error.message;
  }
};

// 🔹 Generate Refresh Token
photographerSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      { id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );
  } catch (error) {
    return error.message;
  }
};

// 🔹 Generate Verification Token
photographerSchema.methods.generateVerificationToken = function () {
  try {
    return jwt.sign(
      { id: this._id },
      process.env.VERIFICATION_SECRET,
      {
        expiresIn: process.env.VERIFICATION_EXPIRY
      }
    );
  } catch (error) {
    return error.message;
  }
};

module.exports = mongoose.model('Photographer', photographerSchema);

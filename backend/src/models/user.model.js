import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Schema Definition
const userSchema = new mongoose.Schema({
  // Core Info
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'photographer', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  // Images
  avatar: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Bookings
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  // Auth/session
  refreshToken: {
    type: String,
    select: false
  },
  // Social/channel features
   verificationToken:{
        type:String
    },
    verificationTokenExpiry:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
}, {
  timestamps: true
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Methods for password check and JWT
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        id: this._id,
        role: this.role,
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

userSchema.methods.generateRefreshToken = function () {
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

userSchema.methods.generateVerificationToken = function () {
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

export const User = mongoose.model('User', userSchema);

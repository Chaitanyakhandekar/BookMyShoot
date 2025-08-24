const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update rating when reviews change
photographerSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ photographer: this._id });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / reviews.length;
    this.rating.count = reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }
  
  await this.save();
};

module.exports = mongoose.model('Photographer', photographerSchema);

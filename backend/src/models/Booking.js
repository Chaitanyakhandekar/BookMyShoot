const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photographer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photographer',
    required: true
  },
  eventType: {
    type: String,
    required: [true, 'Please specify the event type'],
    enum: ['wedding', 'portrait', 'event', 'commercial', 'fashion', 'landscape', 'videography', 'other']
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide the event date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time']
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  packageSelected: {
    name: String,
    price: Number,
    description: String
  },
  customRequirements: {
    type: String,
    maxlength: 1000
  },
  guestCount: {
    type: Number,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    advanceAmount: Number,
    advancePaid: {
      type: Boolean,
      default: false
    },
    finalAmount: Number,
    finalPaid: {
      type: Boolean,
      default: false
    },
    paymentMethod: String,
    transactionIds: [String]
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  cancellationReason: String,
  cancellationDate: Date,
  cancellationPolicy: {
    refundPercentage: Number,
    refundAmount: Number
  }
}, {
  timestamps: true
});

// Index for efficient querying
bookingSchema.index({ photographer: 1, eventDate: 1 });
bookingSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

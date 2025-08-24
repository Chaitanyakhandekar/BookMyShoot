const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
    maxlength: 1000
  },
  aspects: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  photos: [String], // URLs to review photos
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  photographerResponse: {
    message: String,
    date: Date
  }
}, {
  timestamps: true
});

// Ensure one review per booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

// Update photographer rating after review save/update/delete
reviewSchema.post('save', async function() {
  const Photographer = mongoose.model('Photographer');
  const photographer = await Photographer.findById(this.photographer);
  if (photographer) {
    await photographer.updateRating();
  }
});

reviewSchema.post('remove', async function() {
  const Photographer = mongoose.model('Photographer');
  const photographer = await Photographer.findById(this.photographer);
  if (photographer) {
    await photographer.updateRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);

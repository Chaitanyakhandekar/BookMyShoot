const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Photographer = require('../models/Photographer');
const { reviews } = require('../utils/mockData');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (User only)
const createReview = async (req, res) => {
  try {
    const { photographer, booking, rating, comment } = req.body;

    if (isMongoConnected()) {
      // Check if booking exists and belongs to the user
      const bookingExists = await Booking.findOne({
        _id: booking,
        user: req.user.id,
        status: 'completed'
      });

      if (!bookingExists) {
        return res.status(400).json({
          success: false,
          message: 'You can only review completed bookings that belong to you'
        });
      }

      // Check if user has already reviewed this booking
      const existingReview = await Review.findOne({
        user: req.user.id,
        booking: booking
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this booking'
        });
      }

      const review = await Review.create({
        user: req.user.id,
        photographer,
        booking,
        rating,
        comment
      });

      await review.populate([
        { path: 'user', select: 'name avatar' },
        { path: 'photographer', select: 'businessName' }
      ]);

      // Update photographer's average rating
      await updatePhotographerRating(photographer);

      res.status(201).json({
        success: true,
        data: review
      });
    } else {
      // Use mock data
      const newReview = {
        id: Date.now().toString(),
        user: req.user.id,
        photographer,
        booking,
        rating,
        comment,
        createdAt: new Date()
      };

      reviews.push(newReview);

      res.status(201).json({
        success: true,
        data: newReview
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Get reviews for a photographer
// @route   GET /api/reviews/photographer/:id
// @access  Public
const getPhotographerReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    if (isMongoConnected()) {
      const photographerReviews = await Review.find({ 
        photographer: req.params.id 
      })
        .populate('user', 'name avatar')
        .populate('booking', 'eventType eventDate')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Review.countDocuments({ photographer: req.params.id });

      // Calculate rating statistics
      const ratingStats = await Review.aggregate([
        { $match: { photographer: req.params.id } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratings: { $push: '$rating' }
          }
        }
      ]);

      const stats = ratingStats[0] || { averageRating: 0, totalReviews: 0, ratings: [] };
      
      // Calculate rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: stats.ratings.filter(r => r === rating).length
      }));

      res.json({
        success: true,
        data: photographerReviews,
        stats: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalReviews: stats.totalReviews,
          ratingDistribution
        },
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Use mock data
      const photographerReviews = reviews.filter(r => r.photographer === req.params.id);
      
      const averageRating = photographerReviews.length > 0 
        ? photographerReviews.reduce((sum, r) => sum + r.rating, 0) / photographerReviews.length 
        : 0;

      res.json({
        success: true,
        data: photographerReviews,
        stats: {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: photographerReviews.length,
          ratingDistribution: []
        },
        pagination: {
          page: 1,
          pages: 1,
          total: photographerReviews.length
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    if (isMongoConnected()) {
      const userReviews = await Review.find({ user: req.user.id })
        .populate('photographer', 'businessName user')
        .populate('booking', 'eventType eventDate')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Review.countDocuments({ user: req.user.id });

      res.json({
        success: true,
        data: userReviews,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Use mock data
      const userReviews = reviews.filter(r => r.user === req.user.id);

      res.json({
        success: true,
        data: userReviews,
        pagination: {
          page: 1,
          pages: 1,
          total: userReviews.length
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user reviews'
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (User who created the review)
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (isMongoConnected()) {
      let review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review
      if (review.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this review'
        });
      }

      review = await Review.findByIdAndUpdate(
        req.params.id,
        { rating, comment },
        { new: true, runValidators: true }
      ).populate([
        { path: 'user', select: 'name avatar' },
        { path: 'photographer', select: 'businessName' }
      ]);

      // Update photographer's average rating
      await updatePhotographerRating(review.photographer._id);

      res.json({
        success: true,
        data: review
      });
    } else {
      // Use mock data
      const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
      
      if (reviewIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        rating,
        comment,
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: reviews[reviewIndex]
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (User who created the review or Admin)
const deleteReview = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const review = await Review.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review or is admin
      if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }

      const photographerId = review.photographer;
      await review.deleteOne();

      // Update photographer's average rating
      await updatePhotographerRating(photographerId);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } else {
      // Use mock data
      const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
      
      if (reviewIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      reviews.splice(reviewIndex, 1);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting review'
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const review = await Review.findById(req.params.id)
        .populate('user', 'name avatar')
        .populate('photographer', 'businessName')
        .populate('booking', 'eventType eventDate');

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        data: review
      });
    } else {
      // Use mock data
      const review = reviews.find(r => r.id === req.params.id);
      
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        data: review
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review'
    });
  }
};

// Helper function to update photographer's average rating
const updatePhotographerRating = async (photographerId) => {
  try {
    const reviews = await Review.find({ photographer: photographerId });
    
    if (reviews.length === 0) {
      await Photographer.findByIdAndUpdate(photographerId, {
        rating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Photographer.findByIdAndUpdate(photographerId, {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error updating photographer rating:', error);
  }
};

module.exports = {
  createReview,
  getPhotographerReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getReview
};

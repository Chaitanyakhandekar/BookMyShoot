const User = require('../models/User');
const Photographer = require('../models/Photographer');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const [
        totalUsers,
        totalPhotographers,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalReviews,
        pendingPhotographers
      ] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Photographer.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'confirmed' }),
        Booking.countDocuments({ status: 'completed' }),
        Review.countDocuments(),
        Photographer.countDocuments({ isVerified: false })
      ]);

      // Get recent activities
      const recentBookings = await Booking.find()
        .populate('user', 'name')
        .populate('photographer', 'businessName')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentReviews = await Review.find()
        .populate('user', 'name')
        .populate('photographer', 'businessName')
        .sort({ createdAt: -1 })
        .limit(5);

      // Calculate monthly growth
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const [newUsersThisMonth, newBookingsThisMonth] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: lastMonth } }),
        Booking.countDocuments({ createdAt: { $gte: lastMonth } })
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalPhotographers,
            totalBookings,
            totalReviews
          },
          bookings: {
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings
          },
          pending: {
            photographers: pendingPhotographers,
            bookings: pendingBookings
          },
          growth: {
            newUsersThisMonth,
            newBookingsThisMonth
          },
          recent: {
            bookings: recentBookings,
            reviews: recentReviews
          }
        }
      });
    } else {
      // Mock data for demo
      res.json({
        success: true,
        data: {
          overview: {
            totalUsers: 150,
            totalPhotographers: 25,
            totalBookings: 89,
            totalReviews: 67
          },
          bookings: {
            pending: 12,
            confirmed: 18,
            completed: 45
          },
          pending: {
            photographers: 3,
            bookings: 12
          },
          growth: {
            newUsersThisMonth: 23,
            newBookingsThisMonth: 31
          },
          recent: {
            bookings: [],
            reviews: []
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    if (isMongoConnected()) {
      let query = {};
      
      if (role) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Mock data
      res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get all photographers
// @route   GET /api/admin/photographers
// @access  Private (Admin only)
const getAllPhotographers = async (req, res) => {
  try {
    const { verified, search, page = 1, limit = 20 } = req.query;

    if (isMongoConnected()) {
      let query = {};
      
      if (verified !== undefined) {
        query.isVerified = verified === 'true';
      }
      
      if (search) {
        query.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      const photographers = await Photographer.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Photographer.countDocuments(query);

      res.json({
        success: true,
        data: photographers,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Mock data
      res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching photographers'
    });
  }
};

// @desc    Get pending photographer verifications
// @route   GET /api/admin/photographers/pending
// @access  Private (Admin only)
const getPendingPhotographers = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const photographers = await Photographer.find({ isVerified: false })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: photographers
      });
    } else {
      // Mock data
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending photographers'
    });
  }
};

// @desc    Verify photographer
// @route   PUT /api/admin/photographers/:id/verify
// @access  Private (Admin only)
const verifyPhotographer = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const photographer = await Photographer.findByIdAndUpdate(
        req.params.id,
        { isVerified: true, verifiedAt: new Date() },
        { new: true }
      ).populate('user', 'name email');

      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      res.json({
        success: true,
        data: photographer,
        message: 'Photographer verified successfully'
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: 'Photographer verified successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying photographer'
    });
  }
};

// @desc    Reject photographer
// @route   PUT /api/admin/photographers/:id/reject
// @access  Private (Admin only)
const rejectPhotographer = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (isMongoConnected()) {
      const photographer = await Photographer.findByIdAndUpdate(
        req.params.id,
        { 
          isVerified: false, 
          rejectionReason,
          rejectedAt: new Date()
        },
        { new: true }
      ).populate('user', 'name email');

      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      res.json({
        success: true,
        data: photographer,
        message: 'Photographer rejected'
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: 'Photographer rejected'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting photographer'
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (isMongoConnected()) {
      let query = {};
      
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .populate('user', 'name email')
        .populate({
          path: 'photographer',
          populate: {
            path: 'user',
            select: 'name email'
          }
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        data: bookings,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Mock data
      res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          pages: 1,
          total: 0
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // Changed from isActive to status

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "suspended"'
      });
    }

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user,
        message: `User status updated to ${status}`
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: `User status updated to ${status}`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
};

// @desc    Update photographer approval status
// @route   PUT /api/admin/photographers/:id/status
// @access  Private (Admin only)
const updatePhotographerStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (isMongoConnected()) {
      const photographer = await Photographer.findByIdAndUpdate(
        req.params.id,
        { isApproved },
        { new: true }
      ).populate('user', 'name email');

      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      res.json({
        success: true,
        data: photographer,
        message: `Photographer ${isApproved ? 'approved' : 'rejected'} successfully`
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: `Photographer ${isApproved ? 'approved' : 'rejected'} successfully`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating photographer status'
    });
  }
};

// @desc    Delete photographer
// @route   DELETE /api/admin/photographers/:id
// @access  Private (Admin only)
const deletePhotographer = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const photographer = await Photographer.findById(req.params.id);

      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      await photographer.deleteOne();

      // Also delete related bookings and reviews
      await Promise.all([
        Booking.deleteMany({ photographer: req.params.id }),
        Review.deleteMany({ photographer: req.params.id })
      ]);

      res.json({
        success: true,
        message: 'Photographer and related data deleted successfully'
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: 'Photographer deleted successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting photographer'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    if (isMongoConnected()) {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('user', 'name email')
       .populate('photographer', 'businessName');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking,
        message: `Booking status updated to ${status}`
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: `Booking status updated to ${status}`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Don't allow deletion of admin users
      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      await user.deleteOne();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      // Mock data
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    if (isMongoConnected()) {
      // User registration trends
      const userRegistrations = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Booking trends
      const bookingTrends = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);

      // Revenue trends (if pricing data is available)
      const revenueTrends = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            totalRevenue: { $sum: '$budget' },
            bookingCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Popular specializations
      const popularSpecializations = await Photographer.aggregate([
        { $unwind: '$specializations' },
        {
          $group: {
            _id: '$specializations',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      res.json({
        success: true,
        data: {
          userRegistrations,
          bookingTrends,
          revenueTrends,
          popularSpecializations
        }
      });
    } else {
      // Mock analytics data
      res.json({
        success: true,
        data: {
          userRegistrations: [],
          bookingTrends: [],
          revenueTrends: [],
          popularSpecializations: []
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllPhotographers,
  getPendingPhotographers,
  verifyPhotographer,
  rejectPhotographer,
  getAllBookings,
  updateUserStatus,
  deleteUser,
  getAnalytics,
  updatePhotographerStatus,
  deletePhotographer,
  updateBookingStatus
};

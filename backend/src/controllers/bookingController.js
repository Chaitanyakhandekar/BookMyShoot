const Booking = require('../models/Booking');
const Photographer = require('../models/Photographer');
const User = require('../models/User');
const { bookings } = require('../utils/mockData');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const {
      photographer,
      eventType,
      eventDate,
      startTime,
      endTime,
      location,
      guestCount,
      additionalRequests,
      budget
    } = req.body;

    if (isMongoConnected()) {
      // Check if photographer exists
      const photographerExists = await Photographer.findById(photographer);
      if (!photographerExists) {
        return res.status(404).json({
          success: false,
          message: 'Photographer not found'
        });
      }

      // Check if photographer is available on the requested date
      const existingBooking = await Booking.findOne({
        photographer,
        eventDate,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          {
            startTime: { $lte: startTime },
            endTime: { $gte: startTime }
          },
          {
            startTime: { $lte: endTime },
            endTime: { $gte: endTime }
          },
          {
            startTime: { $gte: startTime },
            endTime: { $lte: endTime }
          }
        ]
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'Photographer is not available at the requested time'
        });
      }

      const booking = await Booking.create({
        user: req.user.id,
        photographer,
        eventType,
        eventDate,
        startTime,
        endTime,
        location,
        guestCount,
        additionalRequests,
        budget,
        status: 'pending'
      });

      await booking.populate([
        { path: 'user', select: 'name email phone' },
        { path: 'photographer', populate: { path: 'user', select: 'name email' } }
      ]);

      res.status(201).json({
        success: true,
        data: booking
      });
    } else {
      // Use mock data
      const newBooking = {
        id: Date.now().toString(),
        user: req.user.id,
        photographer,
        eventType,
        eventDate,
        startTime,
        endTime,
        location,
        guestCount,
        additionalRequests,
        budget,
        status: 'pending',
        createdAt: new Date()
      };

      bookings.push(newBooking);

      res.status(201).json({
        success: true,
        data: newBooking
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    if (isMongoConnected()) {
      let query = { user: req.user.id };
      
      if (status) {
        query.status = status;
      }

      const userBookings = await Booking.find(query)
        .populate('photographer', 'businessName user location')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        data: userBookings,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Use mock data
      let userBookings = bookings.filter(b => b.user === req.user.id);
      
      if (status) {
        userBookings = userBookings.filter(b => b.status === status);
      }

      res.json({
        success: true,
        data: userBookings,
        pagination: {
          page: 1,
          pages: 1,
          total: userBookings.length
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

// @desc    Get photographer's bookings
// @route   GET /api/bookings/photographer
// @access  Private (Photographer only)
const getPhotographerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    if (isMongoConnected()) {
      // Find photographer profile for the current user
      const photographer = await Photographer.findOne({ user: req.user.id });
      if (!photographer) {
        return res.status(404).json({
          success: false,
          message: 'Photographer profile not found'
        });
      }

      let query = { photographer: photographer._id };
      
      if (status) {
        query.status = status;
      }

      const photographerBookings = await Booking.find(query)
        .populate('user', 'name email phone')
        .populate('photographer', 'businessName')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Booking.countDocuments(query);

      res.json({
        success: true,
        data: photographerBookings,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Use mock data
      let photographerBookings = bookings.filter(b => b.photographer === req.user.id);
      
      if (status) {
        photographerBookings = photographerBookings.filter(b => b.status === status);
      }

      res.json({
        success: true,
        data: photographerBookings,
        pagination: {
          page: 1,
          pages: 1,
          total: photographerBookings.length
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching photographer bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate({
          path: 'photographer',
          populate: {
            path: 'user',
            select: 'name email'
          }
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if user owns the booking or is the photographer or is admin
      const photographer = await Photographer.findOne({ user: req.user.id });
      const isOwner = booking.user._id.toString() === req.user.id;
      const isPhotographer = photographer && booking.photographer._id.toString() === photographer._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isPhotographer && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this booking'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } else {
      // Use mock data
      const booking = bookings.find(b => b.id === req.params.id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Photographer/Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const validStatuses = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    if (isMongoConnected()) {
      let booking = await Booking.findById(req.params.id)
        .populate('photographer', 'user');

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if user is the photographer or admin
      const isPhotographer = booking.photographer.user.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isPhotographer && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this booking'
        });
      }

      const updateData = { status };
      if (status === 'rejected' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate([
        { path: 'user', select: 'name email phone' },
        { path: 'photographer', populate: { path: 'user', select: 'name email' } }
      ]);

      res.json({
        success: true,
        data: booking
      });
    } else {
      // Use mock data
      const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: bookings[bookingIndex]
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

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User who made the booking)
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    if (isMongoConnected()) {
      let booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if user owns the booking
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking'
        });
      }

      // Check if booking can be cancelled
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Booking cannot be cancelled in its current status'
        });
      }

      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { 
          status: 'cancelled',
          cancellationReason 
        },
        { new: true }
      ).populate([
        { path: 'user', select: 'name email phone' },
        { path: 'photographer', populate: { path: 'user', select: 'name email' } }
      ]);

      res.json({
        success: true,
        data: booking
      });
    } else {
      // Use mock data
      const bookingIndex = bookings.findIndex(b => b.id === req.params.id);
      
      if (bookingIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        status: 'cancelled',
        cancellationReason,
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: bookings[bookingIndex]
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin/all
// @access  Private (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (isMongoConnected()) {
      let query = {};
      
      if (status) {
        query.status = status;
      }

      const allBookings = await Booking.find(query)
        .populate('user', 'name email phone')
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
        data: allBookings,
        pagination: {
          page: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      });
    } else {
      // Use mock data
      let allBookings = [...bookings];
      
      if (status) {
        allBookings = allBookings.filter(b => b.status === status);
      }

      res.json({
        success: true,
        data: allBookings,
        pagination: {
          page: 1,
          pages: 1,
          total: allBookings.length
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching all bookings'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getPhotographerBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
};

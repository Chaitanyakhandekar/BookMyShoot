const express = require('express');
const { protect, isPhotographerOrAdmin, isAdmin } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getPhotographerBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User booking routes
router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/photographer', isPhotographerOrAdmin, getPhotographerBookings);
router.get('/admin/all', isAdmin, getAllBookings);
router.get('/:id', getBooking);

// Booking management routes
router.put('/:id/status', isPhotographerOrAdmin, updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

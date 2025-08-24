const express = require('express');
const { protect, isAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(isAdmin);

// Dashboard and analytics
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Photographer management
router.get('/photographers', getAllPhotographers);
router.get('/photographers/pending', getPendingPhotographers);
router.put('/photographers/:id/verify', verifyPhotographer);
router.put('/photographers/:id/reject', rejectPhotographer);
router.put('/photographers/:id/status', updatePhotographerStatus);
router.delete('/photographers/:id', deletePhotographer);

// Booking management
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

module.exports = router;

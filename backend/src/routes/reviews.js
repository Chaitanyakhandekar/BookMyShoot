const express = require('express');
const { protect, isAdmin } = require('../middleware/auth');
const {
  createReview,
  getPhotographerReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  getReview
} = require('../controllers/reviewController');

const router = express.Router();

// Public routes
router.get('/photographer/:id', getPhotographerReviews);
router.get('/:id', getReview);

// Protected routes
router.use(protect);

// User review routes
router.post('/', createReview);
router.get('/user/my-reviews', getUserReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;

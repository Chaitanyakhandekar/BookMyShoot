const express = require('express');
const { protect, isPhotographerOrAdmin } = require('../middleware/auth');
const {
  getPhotographers,
  getPhotographer,
  createPhotographer,
  updatePhotographer,
  deletePhotographer,
  getMyProfile
} = require('../controllers/photographerController');

const router = express.Router();

// Public routes
router.get('/', getPhotographers);
router.get('/:id', getPhotographer);

// Protected routes
router.use(protect);

// Photographer routes
router.get('/me/profile', isPhotographerOrAdmin, getMyProfile);
router.post('/', isPhotographerOrAdmin, createPhotographer);
router.put('/:id', isPhotographerOrAdmin, updatePhotographer);
router.delete('/:id', isPhotographerOrAdmin, deletePhotographer);

module.exports = router;

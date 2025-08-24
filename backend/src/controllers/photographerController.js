const Photographer = require('../models/Photographer');
const User = require('../models/User');
const Review = require('../models/Review');
const { photographers } = require('../utils/mockData');

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// @desc    Get all photographers
// @route   GET /api/photographers
// @access  Public
const getPhotographers = async (req, res) => {
  try {
    const { search, specialization, location, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    if (isMongoConnected()) {
      let query = { isVerified: true };
      
      // Build search query
      if (search) {
        query.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
          { 'specializations': { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      if (specialization) {
        query.specializations = { $in: [specialization] };
      }
      
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      
      if (minPrice || maxPrice) {
        query.pricing = {};
        if (minPrice) query.pricing.$gte = Number(minPrice);
        if (maxPrice) query.pricing.$lte = Number(maxPrice);
      }

      const photographers = await Photographer.find(query)
        .populate('user', 'name email avatar')
        .populate('reviews')
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
      // Use mock data
      let filteredPhotographers = photographers.filter(p => p.isVerified);
      
      if (search) {
        filteredPhotographers = filteredPhotographers.filter(p => 
          p.businessName.toLowerCase().includes(search.toLowerCase()) ||
          p.bio.toLowerCase().includes(search.toLowerCase()) ||
          p.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      if (specialization) {
        filteredPhotographers = filteredPhotographers.filter(p => 
          p.specializations.includes(specialization)
        );
      }
      
      if (location) {
        filteredPhotographers = filteredPhotographers.filter(p => 
          p.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      res.json({
        success: true,
        data: filteredPhotographers,
        pagination: {
          page: 1,
          pages: 1,
          total: filteredPhotographers.length
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

// @desc    Get single photographer
// @route   GET /api/photographers/:id
// @access  Public
const getPhotographer = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const photographer = await Photographer.findById(req.params.id)
        .populate('user', 'name email avatar')
        .populate({
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name avatar'
          }
        });

      if (!photographer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer not found' 
        });
      }

      res.json({
        success: true,
        data: photographer
      });
    } else {
      // Use mock data
      const photographer = photographers.find(p => p.id === req.params.id);
      
      if (!photographer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer not found' 
        });
      }

      res.json({
        success: true,
        data: photographer
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching photographer' 
    });
  }
};

// @desc    Create photographer profile
// @route   POST /api/photographers
// @access  Private (Photographer only)
const createPhotographer = async (req, res) => {
  try {
    const {
      businessName,
      bio,
      specializations,
      location,
      pricing,
      availability,
      portfolio,
      equipment,
      experience,
      socialLinks
    } = req.body;

    if (isMongoConnected()) {
      // Check if photographer profile already exists
      const existingPhotographer = await Photographer.findOne({ user: req.user.id });
      if (existingPhotographer) {
        return res.status(400).json({ 
          success: false, 
          message: 'Photographer profile already exists' 
        });
      }

      const photographer = await Photographer.create({
        user: req.user.id,
        businessName,
        bio,
        specializations,
        location,
        pricing,
        availability,
        portfolio,
        equipment,
        experience,
        socialLinks
      });

      await photographer.populate('user', 'name email avatar');

      res.status(201).json({
        success: true,
        data: photographer
      });
    } else {
      // Use mock data
      const newPhotographer = {
        id: Date.now().toString(),
        user: req.user.id,
        businessName,
        bio,
        specializations,
        location,
        pricing,
        availability,
        portfolio,
        equipment,
        experience,
        socialLinks,
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        createdAt: new Date()
      };

      photographers.push(newPhotographer);

      res.status(201).json({
        success: true,
        data: newPhotographer
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating photographer profile' 
    });
  }
};

// @desc    Update photographer profile
// @route   PUT /api/photographers/:id
// @access  Private (Photographer/Admin only)
const updatePhotographer = async (req, res) => {
  try {
    if (isMongoConnected()) {
      let photographer = await Photographer.findById(req.params.id);

      if (!photographer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer not found' 
        });
      }

      // Check ownership or admin role
      if (photographer.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to update this profile' 
        });
      }

      photographer = await Photographer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('user', 'name email avatar');

      res.json({
        success: true,
        data: photographer
      });
    } else {
      // Use mock data
      const photographerIndex = photographers.findIndex(p => p.id === req.params.id);
      
      if (photographerIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer not found' 
        });
      }

      photographers[photographerIndex] = {
        ...photographers[photographerIndex],
        ...req.body,
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: photographers[photographerIndex]
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating photographer profile' 
    });
  }
};

// @desc    Delete photographer profile
// @route   DELETE /api/photographers/:id
// @access  Private (Photographer/Admin only)
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

      // Check ownership or admin role
      if (photographer.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to delete this profile' 
        });
      }

      await photographer.deleteOne();

      res.json({
        success: true,
        message: 'Photographer profile deleted successfully'
      });
    } else {
      // Use mock data
      const photographerIndex = photographers.findIndex(p => p.id === req.params.id);
      
      if (photographerIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer not found' 
        });
      }

      photographers.splice(photographerIndex, 1);

      res.json({
        success: true,
        message: 'Photographer profile deleted successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting photographer profile' 
    });
  }
};

// @desc    Get photographer's own profile
// @route   GET /api/photographers/me
// @access  Private (Photographer only)
const getMyProfile = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const photographer = await Photographer.findOne({ user: req.user.id })
        .populate('user', 'name email avatar')
        .populate({
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name avatar'
          }
        });

      if (!photographer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer profile not found' 
        });
      }

      res.json({
        success: true,
        data: photographer
      });
    } else {
      // Use mock data
      const photographer = photographers.find(p => p.user === req.user.id);
      
      if (!photographer) {
        return res.status(404).json({ 
          success: false, 
          message: 'Photographer profile not found' 
        });
      }

      res.json({
        success: true,
        data: photographer
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile' 
    });
  }
};

module.exports = {
  getPhotographers,
  getPhotographer,
  createPhotographer,
  updatePhotographer,
  deletePhotographer,
  getMyProfile
};

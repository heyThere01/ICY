const express = require('express');
const { authenticateToken } = require('./auth');
const Brand = require('../models/Brand');

const router = express.Router();

// @route   GET /api/brands
// @desc    Get user's brands
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const brands = await Brand.find({ user: req.user.id, isActive: true });
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// @route   POST /api/brands
// @desc    Create new brand
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const brandData = { ...req.body, user: req.user.id };
    const brand = new Brand(brandData);
    await brand.save();
    
    res.status(201).json({
      message: 'Brand created successfully',
      brand
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
});

module.exports = router;
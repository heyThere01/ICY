const express = require('express');
const { authenticateToken } = require('./auth');
const Campaign = require('../models/Campaign');

const router = express.Router();

// @route   GET /api/campaigns
// @desc    Get user's campaigns
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id })
      .populate('brand')
      .populate('influencers.influencer')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

module.exports = router;
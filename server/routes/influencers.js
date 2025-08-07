const express = require('express');
const { authenticateToken } = require('./auth');
const Influencer = require('../models/Influencer');

const router = express.Router();

// @route   GET /api/influencers
// @desc    Get influencers with filtering
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, tier, minFollowers, maxFollowers, page = 1, limit = 12 } = req.query;
    
    let query = { status: 'active' };
    
    if (category) query['content.categories'] = { $in: [category] };
    if (tier) query.tier = tier;
    if (minFollowers || maxFollowers) {
      query['platforms.followers'] = {};
      if (minFollowers) query['platforms.followers'].$gte = parseInt(minFollowers);
      if (maxFollowers) query['platforms.followers'].$lte = parseInt(maxFollowers);
    }
    
    const influencers = await Influencer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'engagement.averageEngagementRate': -1 });
      
    const total = await Influencer.countDocuments(query);
    
    res.json({
      influencers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Get influencers error:', error);
    res.status(500).json({ error: 'Failed to fetch influencers' });
  }
});

// @route   GET /api/influencers/:id
// @desc    Get influencer by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    console.error('Get influencer error:', error);
    res.status(500).json({ error: 'Failed to fetch influencer' });
  }
});

module.exports = router;
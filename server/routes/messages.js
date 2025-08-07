const express = require('express');
const { authenticateToken } = require('./auth');
const Message = require('../models/Message');

const router = express.Router();

// @route   GET /api/messages
// @desc    Get user's messages
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user.id })
      .populate('influencer')
      .populate('brand')
      .populate('campaign')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
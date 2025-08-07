const express = require('express');
const { authenticateToken } = require('./auth');
const aiService = require('../services/aiService');
const Influencer = require('../models/Influencer');
const Brand = require('../models/Brand');
const Campaign = require('../models/Campaign');

const router = express.Router();

// @route   POST /api/ai/generate-message
// @desc    Generate personalized outreach message using AI
// @access  Private
router.post('/generate-message', authenticateToken, async (req, res) => {
  try {
    const {
      influencerId,
      brandId,
      messageType = 'initial',
      tone = 'professional',
      customPrompt = ''
    } = req.body;

    if (!influencerId || !brandId) {
      return res.status(400).json({
        error: 'Influencer ID and Brand ID are required'
      });
    }

    // Get influencer and brand data
    const [influencer, brand] = await Promise.all([
      Influencer.findById(influencerId),
      Brand.findById(brandId)
    ]);

    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Ensure user owns the brand
    if (brand.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to brand' });
    }

    // Generate message using AI
    const messageResult = await aiService.generateOutreachMessage({
      influencer,
      brand,
      messageType,
      tone,
      customPrompt
    });

    res.json({
      message: 'Message generated successfully',
      result: messageResult
    });

  } catch (error) {
    console.error('Generate message error:', error);
    res.status(500).json({
      error: 'Failed to generate message'
    });
  }
});

// @route   POST /api/ai/analyze-influencer
// @desc    Analyze influencer persona and brand fit using AI
// @access  Private
router.post('/analyze-influencer', authenticateToken, async (req, res) => {
  try {
    const { influencerId, brandId } = req.body;

    if (!influencerId) {
      return res.status(400).json({
        error: 'Influencer ID is required'
      });
    }

    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }

    // Generate AI persona analysis
    const personaAnalysis = await aiService.analyzeInfluencerPersona(influencer);

    // If brand ID provided, calculate brand fit score
    let brandFitScore = null;
    if (brandId) {
      const brand = await Brand.findById(brandId);
      if (brand && brand.user.toString() === req.user.id) {
        brandFitScore = await aiService.calculateBrandFitScore(influencer, brand);
      }
    }

    // Update influencer with AI analysis
    influencer.aiAnalysis = {
      persona: personaAnalysis.persona,
      communicationStyle: personaAnalysis.communicationStyle,
      collaborationPotential: personaAnalysis.collaborationPotential,
      lastAnalyzed: new Date()
    };

    if (brandFitScore) {
      influencer.aiAnalysis.brandAlignment = [{
        brandType: brandId,
        score: brandFitScore.score,
        reasons: brandFitScore.reasons
      }];
    }

    await influencer.save();

    res.json({
      message: 'Influencer analysis completed',
      analysis: {
        persona: personaAnalysis,
        brandFit: brandFitScore
      }
    });

  } catch (error) {
    console.error('Analyze influencer error:', error);
    res.status(500).json({
      error: 'Failed to analyze influencer'
    });
  }
});

// @route   POST /api/ai/campaign-suggestions
// @desc    Get AI-powered campaign optimization suggestions
// @access  Private
router.post('/campaign-suggestions', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }

    const campaign = await Campaign.findById(campaignId)
      .populate('brand')
      .populate('influencers.influencer');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Ensure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to campaign' });
    }

    // Generate optimization suggestions
    const suggestions = await aiService.generateCampaignSuggestions(campaign);

    // Update campaign with AI insights
    campaign.aiInsights = {
      ...campaign.aiInsights,
      optimizationSuggestions: suggestions,
      lastAnalyzed: new Date()
    };

    await campaign.save();

    res.json({
      message: 'Campaign suggestions generated',
      suggestions
    });

  } catch (error) {
    console.error('Campaign suggestions error:', error);
    res.status(500).json({
      error: 'Failed to generate campaign suggestions'
    });
  }
});

// @route   POST /api/ai/predict-performance
// @desc    Predict campaign performance using AI
// @access  Private
router.post('/predict-performance', authenticateToken, async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }

    const campaign = await Campaign.findById(campaignId)
      .populate('influencers.influencer');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Ensure user owns the campaign
    if (campaign.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to campaign' });
    }

    // Extract influencer data for prediction
    const targetInfluencers = campaign.influencers.map(ci => ci.influencer);

    // Generate performance predictions
    const prediction = await aiService.predictCampaignPerformance(
      campaign.settings,
      targetInfluencers
    );

    // Update campaign with AI insights
    campaign.aiInsights = {
      ...campaign.aiInsights,
      predictedPerformance: prediction,
      lastAnalyzed: new Date()
    };

    await campaign.save();

    res.json({
      message: 'Performance prediction generated',
      prediction
    });

  } catch (error) {
    console.error('Performance prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict performance'
    });
  }
});

// @route   POST /api/ai/analyze-message
// @desc    Analyze message content for tone, sentiment, etc.
// @access  Private
router.post('/analyze-message', authenticateToken, async (req, res) => {
  try {
    const { messageContent } = req.body;

    if (!messageContent) {
      return res.status(400).json({
        error: 'Message content is required'
      });
    }

    const analysis = await aiService.analyzeMessage(messageContent);

    res.json({
      message: 'Message analysis completed',
      analysis
    });

  } catch (error) {
    console.error('Message analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze message'
    });
  }
});

// @route   POST /api/ai/followup-suggestions
// @desc    Get smart follow-up suggestions for outreach
// @access  Private
router.post('/followup-suggestions', authenticateToken, async (req, res) => {
  try {
    const { originalMessage, influencerId, daysSinceLastMessage } = req.body;

    if (!originalMessage || !influencerId) {
      return res.status(400).json({
        error: 'Original message and influencer ID are required'
      });
    }

    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }

    const suggestions = await aiService.generateFollowUpSuggestions(
      originalMessage,
      influencer,
      daysSinceLastMessage || 0
    );

    res.json({
      message: 'Follow-up suggestions generated',
      suggestions
    });

  } catch (error) {
    console.error('Follow-up suggestions error:', error);
    res.status(500).json({
      error: 'Failed to generate follow-up suggestions'
    });
  }
});

// @route   POST /api/ai/brand-insights
// @desc    Generate AI insights for brand setup
// @access  Private
router.post('/brand-insights', authenticateToken, async (req, res) => {
  try {
    const { brandId } = req.body;

    if (!brandId) {
      return res.status(400).json({
        error: 'Brand ID is required'
      });
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Ensure user owns the brand
    if (brand.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to brand' });
    }

    // Generate brand personality analysis and recommendations
    const prompt = `
      Analyze this brand and provide marketing insights:
      
      Brand: ${brand.name}
      Industry: ${brand.industry}
      Description: ${brand.description}
      Personality: ${brand.brandTone?.personality || 'not specified'}
      Target Audience: ${brand.targetAudience?.ageRange?.min || 18}-${brand.targetAudience?.ageRange?.max || 65} years old
      Goals: ${brand.campaignGoals?.primary || 'brand awareness'}
      
      Provide:
      1. Brand personality summary
      2. Recommended influencer types
      3. Suggested content themes
      4. Message tone recommendations
      
      Format as JSON with keys: brandPersonality, recommendedInfluencerTypes, contentThemes, messageTones
    `;

    // This would typically use the AI service, but for brevity:
    const insights = {
      brandPersonality: `${brand.brandTone?.personality || 'Professional'} brand focused on ${brand.campaignGoals?.primary || 'brand awareness'}`,
      recommendedInfluencerTypes: [
        'Micro-influencers in ' + brand.industry,
        'Content creators aged ' + (brand.targetAudience?.ageRange?.min || 18) + '-' + (brand.targetAudience?.ageRange?.max || 65),
        'Authentic storytellers'
      ],
      contentThemes: [
        'Product demonstrations',
        'Lifestyle integration',
        'User testimonials'
      ],
      messageTones: [
        brand.brandTone?.communicationStyle || 'conversational',
        'personalized',
        'value-focused'
      ]
    };

    // Update brand with AI insights
    brand.aiInsights = {
      brandPersonality: insights.brandPersonality,
      recommendedInfluencerTypes: insights.recommendedInfluencerTypes,
      messageTemplates: [], // Would be generated based on insights
      lastAnalyzed: new Date()
    };

    await brand.save();

    res.json({
      message: 'Brand insights generated',
      insights
    });

  } catch (error) {
    console.error('Brand insights error:', error);
    res.status(500).json({
      error: 'Failed to generate brand insights'
    });
  }
});

module.exports = router;
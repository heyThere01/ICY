const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    default: null
  },
  
  // Brand Setup Form Data
  productDetails: {
    category: String,
    priceRange: {
      min: Number,
      max: Number
    },
    keyFeatures: [String],
    uniqueSellingPoints: [String]
  },
  
  targetAudience: {
    ageRange: {
      min: Number,
      max: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'all'],
      default: 'all'
    },
    interests: [String],
    location: {
      countries: [String],
      regions: [String]
    },
    demographics: {
      income: String,
      lifestyle: [String]
    }
  },
  
  brandTone: {
    personality: {
      type: String,
      enum: ['professional', 'casual', 'luxury', 'eco-friendly', 'trendy', 'authentic', 'playful'],
      required: true
    },
    communicationStyle: {
      type: String,
      enum: ['formal', 'conversational', 'humorous', 'inspirational', 'educational'],
      required: true
    },
    values: [String],
    voiceDescription: String
  },
  
  campaignGoals: {
    primary: {
      type: String,
      enum: ['brand-awareness', 'product-launch', 'sales-conversion', 'engagement', 'reach'],
      required: true
    },
    secondary: [String],
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    timeline: {
      start: Date,
      end: Date
    },
    expectedROI: String
  },
  
  preferences: {
    influencerTiers: [{
      type: String,
      enum: ['nano', 'micro', 'macro', 'mega']
    }],
    platforms: [{
      type: String,
      enum: ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin']
    }],
    contentTypes: [{
      type: String,
      enum: ['post', 'story', 'reel', 'video', 'review', 'unboxing', 'tutorial']
    }],
    collaborationTypes: [{
      type: String,
      enum: ['sponsored-post', 'product-review', 'giveaway', 'takeover', 'ambassador']
    }]
  },
  
  // AI Analysis Results
  aiInsights: {
    brandPersonality: String,
    recommendedInfluencerTypes: [String],
    messageTemplates: [String],
    lastAnalyzed: Date
  },
  
  // Statistics
  stats: {
    totalCampaigns: {
      type: Number,
      default: 0
    },
    totalInfluencersContacted: {
      type: Number,
      default: 0
    },
    successfulCollaborations: {
      type: Number,
      default: 0
    },
    averageResponseRate: {
      type: Number,
      default: 0
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search optimization
brandSchema.index({ name: 'text', description: 'text', industry: 'text' });
brandSchema.index({ user: 1, isActive: 1 });

// Virtual for success rate
brandSchema.virtual('successRate').get(function() {
  if (this.stats.totalInfluencersContacted === 0) return 0;
  return (this.stats.successfulCollaborations / this.stats.totalInfluencersContacted * 100).toFixed(2);
});

brandSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Brand', brandSchema);
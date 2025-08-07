const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  
  // Campaign Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  objective: {
    type: String,
    enum: ['brand-awareness', 'product-launch', 'sales-conversion', 'engagement', 'reach'],
    required: true
  },
  
  // Campaign Settings
  settings: {
    budget: {
      total: Number,
      spent: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    timeline: {
      start: Date,
      end: Date,
      duration: Number // in days
    },
    targetMetrics: {
      reach: Number,
      engagement: Number,
      conversions: Number,
      impressions: Number
    }
  },
  
  // Influencer Targeting
  targeting: {
    influencerTiers: [{
      type: String,
      enum: ['nano', 'micro', 'macro', 'mega']
    }],
    platforms: [{
      type: String,
      enum: ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin']
    }],
    categories: [String],
    demographics: {
      ageRange: {
        min: Number,
        max: Number
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'all'],
        default: 'all'
      },
      locations: [String]
    },
    minFollowers: Number,
    maxFollowers: Number,
    minEngagementRate: Number
  },
  
  // Influencers in Campaign
  influencers: [{
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Influencer',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'interested', 'negotiating', 'confirmed', 'completed', 'declined', 'failed'],
      default: 'pending'
    },
    addedDate: {
      type: Date,
      default: Date.now
    },
    fitScore: Number, // Brand alignment score 0-100
    estimatedCost: Number,
    negotiatedRate: Number,
    deliverables: [{
      type: {
        type: String,
        enum: ['post', 'story', 'reel', 'video', 'review']
      },
      quantity: Number,
      deadline: Date,
      completed: {
        type: Boolean,
        default: false
      }
    }],
    performance: {
      reach: Number,
      impressions: Number,
      engagement: Number,
      clicks: Number,
      conversions: Number
    },
    notes: String
  }],
  
  // Campaign Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Analytics & Performance
  analytics: {
    totalReach: {
      type: Number,
      default: 0
    },
    totalImpressions: {
      type: Number,
      default: 0
    },
    totalEngagement: {
      type: Number,
      default: 0
    },
    totalClicks: {
      type: Number,
      default: 0
    },
    totalConversions: {
      type: Number,
      default: 0
    },
    averageEngagementRate: {
      type: Number,
      default: 0
    },
    costPerEngagement: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    },
    collaborationRate: {
      type: Number,
      default: 0
    }
  },
  
  // Message Templates
  messageTemplates: [{
    type: {
      type: String,
      enum: ['initial', 'follow-up', 'negotiation', 'confirmation', 'reminder'],
      required: true
    },
    subject: String,
    content: String,
    tone: String,
    aiGenerated: {
      type: Boolean,
      default: false
    }
  }],
  
  // Campaign Timeline
  timeline: [{
    date: Date,
    event: String,
    description: String,
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Influencer'
    }
  }],
  
  // AI Insights
  aiInsights: {
    recommendedInfluencers: [{
      influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Influencer'
      },
      score: Number,
      reasons: [String]
    }],
    optimizationSuggestions: [String],
    predictedPerformance: {
      reach: Number,
      engagement: Number,
      conversions: Number,
      confidence: Number // 0-100
    },
    lastAnalyzed: Date
  },
  
  // Content Requirements
  contentRequirements: {
    guidelines: String,
    hashtags: [String],
    mentions: [String],
    restrictions: [String],
    approvalRequired: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
campaignSchema.index({ user: 1, status: 1 });
campaignSchema.index({ brand: 1, status: 1 });
campaignSchema.index({ 'influencers.influencer': 1 });
campaignSchema.index({ 'settings.timeline.start': 1, 'settings.timeline.end': 1 });

// Virtual for campaign progress
campaignSchema.virtual('progress').get(function() {
  if (this.influencers.length === 0) return 0;
  
  const completedInfluencers = this.influencers.filter(inf => 
    inf.status === 'completed'
  ).length;
  
  return Math.round((completedInfluencers / this.influencers.length) * 100);
});

// Virtual for total cost
campaignSchema.virtual('totalCost').get(function() {
  return this.influencers.reduce((total, inf) => 
    total + (inf.negotiatedRate || inf.estimatedCost || 0), 0
  );
});

// Method to calculate response rate
campaignSchema.methods.calculateResponseRate = function() {
  const contacted = this.influencers.filter(inf => 
    inf.status !== 'pending'
  ).length;
  
  const responded = this.influencers.filter(inf => 
    ['interested', 'negotiating', 'confirmed', 'completed', 'declined'].includes(inf.status)
  ).length;
  
  if (contacted === 0) return 0;
  return Math.round((responded / contacted) * 100);
};

// Method to calculate collaboration rate
campaignSchema.methods.calculateCollaborationRate = function() {
  const contacted = this.influencers.filter(inf => 
    inf.status !== 'pending'
  ).length;
  
  const collaborated = this.influencers.filter(inf => 
    ['confirmed', 'completed'].includes(inf.status)
  ).length;
  
  if (contacted === 0) return 0;
  return Math.round((collaborated / contacted) * 100);
};

// Method to update analytics
campaignSchema.methods.updateAnalytics = function() {
  // Calculate totals from influencer performance
  this.analytics.totalReach = this.influencers.reduce((total, inf) => 
    total + (inf.performance?.reach || 0), 0
  );
  
  this.analytics.totalImpressions = this.influencers.reduce((total, inf) => 
    total + (inf.performance?.impressions || 0), 0
  );
  
  this.analytics.totalEngagement = this.influencers.reduce((total, inf) => 
    total + (inf.performance?.engagement || 0), 0
  );
  
  this.analytics.totalClicks = this.influencers.reduce((total, inf) => 
    total + (inf.performance?.clicks || 0), 0
  );
  
  this.analytics.totalConversions = this.influencers.reduce((total, inf) => 
    total + (inf.performance?.conversions || 0), 0
  );
  
  // Calculate rates
  if (this.analytics.totalImpressions > 0) {
    this.analytics.averageEngagementRate = 
      (this.analytics.totalEngagement / this.analytics.totalImpressions) * 100;
  }
  
  if (this.analytics.totalEngagement > 0) {
    this.analytics.costPerEngagement = 
      this.totalCost / this.analytics.totalEngagement;
  }
  
  this.analytics.responseRate = this.calculateResponseRate();
  this.analytics.collaborationRate = this.calculateCollaborationRate();
  
  return this.save();
};

campaignSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
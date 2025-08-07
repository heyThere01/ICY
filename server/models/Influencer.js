const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  bio: String,
  profileImage: String,
  verified: {
    type: Boolean,
    default: false
  },
  
  // Platform Information
  platforms: [{
    name: {
      type: String,
      enum: ['instagram', 'youtube', 'tiktok', 'twitter', 'linkedin'],
      required: true
    },
    handle: String,
    url: String,
    followers: Number,
    following: Number,
    posts: Number,
    lastUpdated: Date
  }],
  
  // Demographics
  demographics: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'unknown']
    },
    location: {
      country: String,
      city: String,
      timezone: String
    },
    languages: [String]
  },
  
  // Content Analysis
  content: {
    categories: [String], // beauty, fashion, tech, lifestyle, etc.
    avgPostsPerWeek: Number,
    contentTypes: [{
      type: String,
      enum: ['photo', 'video', 'story', 'reel', 'live'],
      percentage: Number
    }],
    hashtagsUsed: [String],
    mentionedBrands: [String]
  },
  
  // Audience Analytics
  audience: {
    totalReach: Number,
    demographics: {
      ageGroups: [{
        range: String, // "18-24", "25-34", etc.
        percentage: Number
      }],
      genderSplit: {
        male: Number,
        female: Number,
        other: Number
      },
      topCountries: [{
        country: String,
        percentage: Number
      }],
      languages: [{
        language: String,
        percentage: Number
      }]
    },
    interests: [{
      category: String,
      affinity: Number // 0-100 score
    }]
  },
  
  // Engagement Metrics
  engagement: {
    averageEngagementRate: Number,
    likesPerPost: Number,
    commentsPerPost: Number,
    sharesPerPost: Number,
    engagementTrend: [{
      date: Date,
      rate: Number
    }],
    bestPostingTimes: [{
      day: String,
      hour: Number,
      engagement: Number
    }]
  },
  
  // Trust & Quality Metrics
  trustMetrics: {
    fakeFollowerPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    authenticityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    spamScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    reachEstimate: Number,
    lastVerified: Date
  },
  
  // AI Analysis
  aiAnalysis: {
    persona: String, // "Eco-Beauty Guru", "Luxury Expert", etc.
    brandAlignment: [{
      brandType: String,
      score: Number, // 0-100
      reasons: [String]
    }],
    communicationStyle: {
      tone: String, // professional, casual, humorous, etc.
      sentiment: String, // positive, neutral, mixed
      topics: [String]
    },
    collaborationPotential: {
      score: Number, // 0-100
      factors: [String]
    },
    lastAnalyzed: Date
  },
  
  // Contact & Collaboration
  contact: {
    preferredContact: {
      type: String,
      enum: ['email', 'dm', 'agent'],
      default: 'dm'
    },
    agent: {
      name: String,
      email: String,
      company: String
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageResponseTime: Number, // in hours
    rates: {
      post: Number,
      story: Number,
      reel: Number,
      video: Number
    }
  },
  
  // Campaign History
  campaignHistory: [{
    brandName: String,
    campaignType: String,
    date: Date,
    performance: {
      reach: Number,
      engagement: Number,
      conversions: Number
    }
  }],
  
  // Tier Classification
  tier: {
    type: String,
    enum: ['nano', 'micro', 'macro', 'mega'],
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    blacklistedBrands: [String],
    preferredBrands: [String],
    exclusiveContracts: [{
      brand: String,
      endDate: Date
    }]
  },
  
  // Internal Tracking
  lastDataFetch: Date,
  dataSource: {
    type: String,
    enum: ['manual', 'api', 'scraping'],
    default: 'api'
  },
  qualityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes for performance
influencerSchema.index({ username: 1 });
influencerSchema.index({ 'platforms.name': 1, 'platforms.followers': -1 });
influencerSchema.index({ tier: 1, status: 1 });
influencerSchema.index({ 'content.categories': 1 });
influencerSchema.index({ 'trustMetrics.authenticityScore': -1 });
influencerSchema.index({ 'engagement.averageEngagementRate': -1 });

// Virtual for total followers across all platforms
influencerSchema.virtual('totalFollowers').get(function() {
  return this.platforms.reduce((total, platform) => total + (platform.followers || 0), 0);
});

// Virtual for engagement quality score
influencerSchema.virtual('engagementQualityScore').get(function() {
  const engagementRate = this.engagement.averageEngagementRate || 0;
  const authenticityScore = this.trustMetrics.authenticityScore || 0;
  return Math.round((engagementRate * 0.6 + authenticityScore * 0.4));
});

// Method to get brand fit score
influencerSchema.methods.getBrandFitScore = function(brandCategories, brandTone) {
  let score = 0;
  
  // Category alignment (40% weight)
  const categoryMatch = this.content.categories.some(cat => 
    brandCategories.includes(cat)
  );
  if (categoryMatch) score += 40;
  
  // Audience quality (30% weight)
  const audienceQuality = (100 - this.trustMetrics.fakeFollowerPercentage) * 0.3;
  score += audienceQuality;
  
  // Engagement rate (20% weight)
  const engagementScore = Math.min(this.engagement.averageEngagementRate * 4, 20);
  score += engagementScore;
  
  // AI persona alignment (10% weight)
  // This would be calculated based on AI analysis
  score += 10;
  
  return Math.min(Math.round(score), 100);
};

// Method to estimate collaboration cost
influencerSchema.methods.estimateCollaborationCost = function(contentType = 'post') {
  const baseCost = this.contact.rates?.[contentType] || 0;
  if (baseCost > 0) return baseCost;
  
  // Estimate based on followers and engagement
  const followers = this.totalFollowers;
  const engagementRate = this.engagement.averageEngagementRate || 2;
  
  let costPerFollower;
  switch (this.tier) {
    case 'nano': costPerFollower = 0.01; break;
    case 'micro': costPerFollower = 0.02; break;
    case 'macro': costPerFollower = 0.05; break;
    case 'mega': costPerFollower = 0.1; break;
    default: costPerFollower = 0.02;
  }
  
  const baseCostEstimate = followers * costPerFollower;
  const engagementMultiplier = 1 + (engagementRate / 100);
  
  return Math.round(baseCostEstimate * engagementMultiplier);
};

influencerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Influencer', influencerSchema);
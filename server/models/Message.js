const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message Content
  subject: String,
  content: {
    type: String,
    required: true
  },
  htmlContent: String, // Rich text version
  
  // Message Type & Status
  type: {
    type: String,
    enum: ['initial', 'follow-up', 'negotiation', 'confirmation', 'reminder', 'thank-you'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'delivered', 'opened', 'replied', 'failed'],
    default: 'draft'
  },
  
  // Send Configuration
  sendConfig: {
    platform: {
      type: String,
      enum: ['email', 'instagram-dm', 'youtube-comment', 'twitter-dm', 'manual'],
      default: 'email'
    },
    recipientEmail: String,
    recipientHandle: String,
    scheduledTime: Date,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  },
  
  // AI Generation Data
  aiGeneration: {
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    prompt: String,
    model: String, // gpt-4, gpt-3.5-turbo, etc.
    tone: {
      type: String,
      enum: ['professional', 'casual', 'friendly', 'formal', 'enthusiastic', 'personal']
    },
    personalizations: [{
      type: String, // recent post, bio mention, mutual connection, etc.
      value: String
    }],
    generatedAt: Date,
    confidence: Number // 0-100
  },
  
  // Message Analysis
  analysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed']
    },
    toneScore: {
      professional: Number,
      casual: Number,
      enthusiastic: Number,
      persuasive: Number
    },
    readabilityScore: Number, // Flesch-Kincaid or similar
    wordCount: Number,
    estimatedReadTime: Number, // in seconds
    personalizedElements: [String],
    callToActionStrength: Number // 0-100
  },
  
  // Delivery & Engagement Tracking
  delivery: {
    sentAt: Date,
    deliveredAt: Date,
    openedAt: Date,
    lastOpenedAt: Date,
    openCount: {
      type: Number,
      default: 0
    },
    clickCount: {
      type: Number,
      default: 0
    },
    linksClicked: [String],
    forwardCount: {
      type: Number,
      default: 0
    }
  },
  
  // Response Tracking
  response: {
    hasResponse: {
      type: Boolean,
      default: false
    },
    responseDate: Date,
    responseTime: Number, // hours from sent to response
    responseType: {
      type: String,
      enum: ['interested', 'not-interested', 'needs-info', 'negotiation', 'acceptance', 'counter-offer']
    },
    responseContent: String,
    responseAttachments: [String],
    responseAnalysis: {
      sentiment: String,
      interest: Number, // 0-100
      likelihood: Number // 0-100 chance of collaboration
    }
  },
  
  // Follow-up Configuration
  followUp: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    scheduleDate: Date,
    followUpType: String,
    remindersSent: {
      type: Number,
      default: 0
    },
    maxReminders: {
      type: Number,
      default: 3
    },
    intervalDays: {
      type: Number,
      default: 7
    }
  },
  
  // A/B Testing
  abTest: {
    isTest: {
      type: Boolean,
      default: false
    },
    variant: String, // A, B, C, etc.
    testName: String,
    controlGroup: Boolean
  },
  
  // Message Performance
  performance: {
    deliveryRate: Number,
    openRate: Number,
    responseRate: Number,
    engagementScore: Number, // 0-100
    conversionScore: Number // 0-100 (led to collaboration)
  },
  
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    timezone: String,
    language: String,
    deviceType: String
  },
  
  // Notes & Tags
  notes: String,
  tags: [String],
  
  // Thread/Conversation Tracking
  thread: {
    threadId: String,
    messageIndex: Number, // Position in conversation
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ campaign: 1, influencer: 1 });
messageSchema.index({ user: 1, status: 1 });
messageSchema.index({ 'sendConfig.scheduledTime': 1, status: 1 });
messageSchema.index({ type: 1, 'delivery.sentAt': -1 });
messageSchema.index({ 'thread.threadId': 1, 'thread.messageIndex': 1 });

// Virtual for message effectiveness
messageSchema.virtual('effectiveness').get(function() {
  let score = 0;
  
  // Delivery success (25%)
  if (this.status === 'delivered' || this.status === 'opened' || this.status === 'replied') {
    score += 25;
  }
  
  // Open rate (25%)
  if (this.delivery.openCount > 0) {
    score += 25;
  }
  
  // Click engagement (25%)
  if (this.delivery.clickCount > 0) {
    score += 25;
  }
  
  // Response (25%)
  if (this.response.hasResponse) {
    score += 25;
  }
  
  return score;
});

// Virtual for response time in human readable format
messageSchema.virtual('responseTimeFormatted').get(function() {
  if (!this.response.responseTime) return null;
  
  const hours = this.response.responseTime;
  if (hours < 24) {
    return `${Math.round(hours)} hours`;
  } else {
    const days = Math.round(hours / 24);
    return `${days} days`;
  }
});

// Method to calculate engagement score
messageSchema.methods.calculateEngagementScore = function() {
  let score = 0;
  
  // Base score for delivery
  if (this.status === 'delivered') score += 20;
  if (this.status === 'opened') score += 30;
  if (this.status === 'replied') score += 50;
  
  // Additional points for engagement
  score += Math.min(this.delivery.openCount * 5, 20);
  score += Math.min(this.delivery.clickCount * 10, 20);
  
  // Response quality bonus
  if (this.response.hasResponse) {
    const interestLevel = this.response.responseAnalysis?.interest || 0;
    score += Math.round(interestLevel * 0.3);
  }
  
  return Math.min(score, 100);
};

// Method to update performance metrics
messageSchema.methods.updatePerformance = function() {
  this.performance.deliveryRate = this.status === 'failed' ? 0 : 100;
  this.performance.openRate = this.delivery.openCount > 0 ? 100 : 0;
  this.performance.responseRate = this.response.hasResponse ? 100 : 0;
  this.performance.engagementScore = this.calculateEngagementScore();
  
  return this.save();
};

// Method to schedule follow-up
messageSchema.methods.scheduleFollowUp = function(days = 7, type = 'follow-up') {
  if (this.response.hasResponse || this.followUp.remindersSent >= this.followUp.maxReminders) {
    return false;
  }
  
  const followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + days);
  
  this.followUp.isScheduled = true;
  this.followUp.scheduleDate = followUpDate;
  this.followUp.followUpType = type;
  
  return this.save();
};

// Static method to get campaign message stats
messageSchema.statics.getCampaignStats = async function(campaignId) {
  const stats = await this.aggregate([
    { $match: { campaign: mongoose.Types.ObjectId(campaignId) } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        sentMessages: { $sum: { $cond: [{ $ne: ['$status', 'draft'] }, 1, 0] } },
        openedMessages: { $sum: { $cond: [{ $gt: ['$delivery.openCount', 0] }, 1, 0] } },
        repliedMessages: { $sum: { $cond: ['$response.hasResponse', 1, 0] } },
        averageResponseTime: { $avg: '$response.responseTime' }
      }
    }
  ]);
  
  if (stats.length === 0) return null;
  
  const result = stats[0];
  result.openRate = result.sentMessages > 0 ? (result.openedMessages / result.sentMessages) * 100 : 0;
  result.responseRate = result.sentMessages > 0 ? (result.repliedMessages / result.sentMessages) * 100 : 0;
  
  return result;
};

messageSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);
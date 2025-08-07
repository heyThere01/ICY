const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Analyze influencer content and generate persona
  async analyzeInfluencerPersona(influencerData) {
    try {
      const prompt = `
        Analyze this influencer's profile and generate a concise persona summary:
        
        Name: ${influencerData.displayName}
        Bio: ${influencerData.bio || 'Not provided'}
        Categories: ${influencerData.content?.categories?.join(', ') || 'Not specified'}
        Followers: ${influencerData.totalFollowers || 0}
        Engagement Rate: ${influencerData.engagement?.averageEngagementRate || 0}%
        Platform: ${influencerData.platforms?.map(p => p.name).join(', ') || 'Not specified'}
        Recent topics: ${influencerData.content?.hashtagsUsed?.slice(0, 10).join(', ') || 'Not available'}
        
        Generate:
        1. A catchy 2-3 word persona title (e.g., "Eco-Beauty Guru", "Luxury Expert")
        2. Communication style analysis (tone, sentiment)
        3. Brand alignment suggestions
        4. Collaboration potential assessment
        
        Format as JSON with keys: persona, communicationStyle, brandAlignment, collaborationPotential
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert influencer marketing analyst. Provide insights in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Persona Analysis Error:', error);
      return {
        persona: 'Content Creator',
        communicationStyle: { tone: 'casual', sentiment: 'positive' },
        brandAlignment: ['general brands'],
        collaborationPotential: { score: 70, factors: ['active engagement', 'regular posting'] }
      };
    }
  }

  // Generate personalized outreach message
  async generateOutreachMessage(options) {
    try {
      const {
        influencer,
        brand,
        messageType = 'initial',
        tone = 'professional',
        customPrompt = '',
        recentPosts = []
      } = options;

      let basePrompt = '';
      
      switch (messageType) {
        case 'initial':
          basePrompt = `Write a personalized initial outreach message for influencer collaboration.`;
          break;
        case 'follow-up':
          basePrompt = `Write a friendly follow-up message for an influencer who hasn't responded.`;
          break;
        case 'negotiation':
          basePrompt = `Write a professional negotiation message regarding collaboration terms.`;
          break;
        default:
          basePrompt = `Write a ${messageType} message for influencer outreach.`;
      }

      const prompt = `
        ${basePrompt}
        
        BRAND INFORMATION:
        - Name: ${brand.name}
        - Industry: ${brand.industry}
        - Description: ${brand.description}
        - Brand Tone: ${brand.brandTone?.personality || 'professional'}
        - Communication Style: ${brand.brandTone?.communicationStyle || 'conversational'}
        - Target Audience: Age ${brand.targetAudience?.ageRange?.min || 18}-${brand.targetAudience?.ageRange?.max || 65}, ${brand.targetAudience?.gender || 'all genders'}
        - Campaign Goal: ${brand.campaignGoals?.primary || 'brand awareness'}
        - Brand Values: ${brand.brandTone?.values?.join(', ') || 'quality, innovation'}
        
        INFLUENCER INFORMATION:
        - Name: ${influencer.displayName}
        - Username: @${influencer.username}
        - Followers: ${influencer.totalFollowers?.toLocaleString() || 'N/A'}
        - Bio: ${influencer.bio || 'Content creator'}
        - Content Categories: ${influencer.content?.categories?.join(', ') || 'lifestyle'}
        - Engagement Rate: ${influencer.engagement?.averageEngagementRate || 'N/A'}%
        - Platform: ${influencer.platforms?.[0]?.name || 'Instagram'}
        - AI Persona: ${influencer.aiAnalysis?.persona || 'Content Creator'}
        
        ${recentPosts.length > 0 ? `RECENT POSTS TO REFERENCE:
        ${recentPosts.map((post, i) => `${i+1}. ${post.caption || post.title}`).join('\n')}` : ''}
        
        REQUIREMENTS:
        - Tone: ${tone}
        - Personalize based on influencer's content and brand fit
        - Keep it concise (150-250 words)
        - Include a clear call-to-action
        - Reference specific aspects of their content if possible
        - Professional but warm approach
        ${customPrompt ? `- Additional requirements: ${customPrompt}` : ''}
        
        Generate ONLY the message content, no subject line or additional formatting.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert influencer marketing professional. Write compelling, personalized outreach messages that get responses. Be authentic, specific, and professional.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const generatedMessage = response.choices[0].message.content.trim();

      // Analyze the generated message
      const analysis = await this.analyzeMessage(generatedMessage);

      return {
        content: generatedMessage,
        analysis,
        metadata: {
          model: 'gpt-4',
          tone,
          messageType,
          generatedAt: new Date(),
          confidence: 85 // Could be calculated based on various factors
        }
      };
    } catch (error) {
      console.error('AI Message Generation Error:', error);
      return {
        content: `Hi ${influencer.displayName},\n\nI hope this message finds you well! I'm reaching out from ${brand.name}, and I've been following your amazing content. We'd love to explore a potential collaboration that aligns with your style and our brand values.\n\nWould you be interested in learning more about a partnership opportunity?\n\nBest regards,\n${brand.name} Team`,
        analysis: {
          sentiment: 'positive',
          tone: 'professional',
          wordCount: 60,
          personalizedElements: ['name mention']
        },
        metadata: {
          model: 'fallback',
          tone,
          messageType,
          generatedAt: new Date(),
          confidence: 50
        }
      };
    }
  }

  // Analyze message content for tone, sentiment, etc.
  async analyzeMessage(messageContent) {
    try {
      const prompt = `
        Analyze this outreach message and provide insights:
        
        "${messageContent}"
        
        Provide analysis for:
        1. Overall sentiment (positive/neutral/negative)
        2. Tone scores (0-100) for: professional, casual, enthusiastic, persuasive
        3. Word count
        4. Estimated read time (seconds)
        5. Personalized elements found
        6. Call-to-action strength (0-100)
        7. Improvement suggestions
        
        Format as JSON with keys: sentiment, toneScore, wordCount, estimatedReadTime, personalizedElements, callToActionStrength, suggestions
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a message analysis expert. Provide detailed analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Message Analysis Error:', error);
      const wordCount = messageContent.split(' ').length;
      return {
        sentiment: 'positive',
        toneScore: {
          professional: 75,
          casual: 60,
          enthusiastic: 70,
          persuasive: 65
        },
        wordCount,
        estimatedReadTime: Math.ceil(wordCount / 3), // ~200 WPM reading speed
        personalizedElements: [],
        callToActionStrength: 60,
        suggestions: ['Consider adding more specific personalization']
      };
    }
  }

  // Calculate brand fit score using AI
  async calculateBrandFitScore(influencer, brand) {
    try {
      const prompt = `
        Calculate brand fit score (0-100) between this influencer and brand:
        
        INFLUENCER:
        - Categories: ${influencer.content?.categories?.join(', ') || 'general'}
        - Audience: ${influencer.audience?.demographics?.ageGroups?.map(ag => ag.range).join(', ') || 'all ages'}
        - Engagement: ${influencer.engagement?.averageEngagementRate || 0}%
        - Authenticity: ${influencer.trustMetrics?.authenticityScore || 80}%
        - Platform: ${influencer.platforms?.[0]?.name || 'instagram'}
        
        BRAND:
        - Industry: ${brand.industry}
        - Target Age: ${brand.targetAudience?.ageRange?.min || 18}-${brand.targetAudience?.ageRange?.max || 65}
        - Personality: ${brand.brandTone?.personality || 'professional'}
        - Goals: ${brand.campaignGoals?.primary || 'awareness'}
        - Values: ${brand.brandTone?.values?.join(', ') || 'quality'}
        
        Consider:
        - Content category alignment (40%)
        - Audience overlap (30%)
        - Engagement quality (20%)
        - Brand safety (10%)
        
        Return JSON with: score (0-100), reasons (array), recommendations (array)
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a brand-influencer matching expert. Provide scoring in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Brand Fit Calculation Error:', error);
      return {
        score: 70,
        reasons: ['General content alignment', 'Good engagement rate'],
        recommendations: ['Review recent content for better alignment assessment']
      };
    }
  }

  // Generate campaign optimization suggestions
  async generateCampaignSuggestions(campaignData) {
    try {
      const prompt = `
        Analyze this influencer marketing campaign and provide optimization suggestions:
        
        CAMPAIGN DATA:
        - Objective: ${campaignData.objective}
        - Budget: $${campaignData.settings?.budget?.total || 0}
        - Influencer Count: ${campaignData.influencers?.length || 0}
        - Response Rate: ${campaignData.analytics?.responseRate || 0}%
        - Collaboration Rate: ${campaignData.analytics?.collaborationRate || 0}%
        - Platforms: ${campaignData.targeting?.platforms?.join(', ') || 'not specified'}
        - Tiers: ${campaignData.targeting?.influencerTiers?.join(', ') || 'all'}
        
        Provide 5 specific, actionable optimization suggestions based on industry best practices.
        Format as JSON array of strings.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an influencer marketing strategist providing optimization advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Campaign Suggestions Error:', error);
      return [
        'Consider testing different message tones to improve response rates',
        'Focus on micro-influencers for higher engagement rates',
        'Personalize outreach messages with specific content references',
        'Test optimal sending times for your target audience',
        'Follow up with non-respondents after 1 week'
      ];
    }
  }

  // Predict campaign performance
  async predictCampaignPerformance(campaignSettings, targetInfluencers) {
    try {
      const avgFollowers = targetInfluencers.reduce((sum, inf) => sum + (inf.totalFollowers || 0), 0) / targetInfluencers.length;
      const avgEngagement = targetInfluencers.reduce((sum, inf) => sum + (inf.engagement?.averageEngagementRate || 2), 0) / targetInfluencers.length;
      
      const prompt = `
        Predict performance for this influencer marketing campaign:
        
        INPUTS:
        - Influencer Count: ${targetInfluencers.length}
        - Average Followers: ${Math.round(avgFollowers)}
        - Average Engagement Rate: ${avgEngagement.toFixed(2)}%
        - Campaign Objective: ${campaignSettings.objective}
        - Budget: $${campaignSettings.budget?.total || 0}
        - Duration: ${campaignSettings.timeline?.duration || 30} days
        
        Predict realistic ranges for:
        - Total Reach
        - Total Impressions  
        - Total Engagement
        - Estimated Conversions
        - Confidence Level (0-100)
        
        Base predictions on industry benchmarks and provided data.
        Format as JSON with keys: reach, impressions, engagement, conversions, confidence
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing analytics expert providing performance predictions based on historical data and industry benchmarks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Performance Prediction Error:', error);
      // Fallback calculation
      const totalFollowers = targetInfluencers.reduce((sum, inf) => sum + (inf.totalFollowers || 0), 0);
      const estimatedReach = Math.round(totalFollowers * 0.3); // 30% reach rate
      const estimatedEngagement = Math.round(estimatedReach * (avgEngagement / 100));
      
      return {
        reach: estimatedReach,
        impressions: Math.round(estimatedReach * 1.5),
        engagement: estimatedEngagement,
        conversions: Math.round(estimatedEngagement * 0.02), // 2% conversion rate
        confidence: 75
      };
    }
  }

  // Generate smart follow-up suggestions
  async generateFollowUpSuggestions(originalMessage, influencerData, daysSinceLastMessage) {
    try {
      const prompt = `
        Generate a follow-up strategy for this influencer outreach:
        
        ORIGINAL MESSAGE:
        "${originalMessage}"
        
        INFLUENCER:
        - Name: ${influencerData.displayName}
        - Response Rate: ${influencerData.contact?.responseRate || 0}%
        - Days Since Last Message: ${daysSinceLastMessage}
        
        Suggest:
        1. Should we follow up? (yes/no with reason)
        2. Optimal timing (days to wait)
        3. Follow-up approach (value-add, different angle, etc.)
        4. Message tone adjustment
        
        Format as JSON with keys: shouldFollowUp, optimalTiming, approach, toneAdjustment
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in influencer outreach timing and follow-up strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 200
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Follow-up Suggestions Error:', error);
      return {
        shouldFollowUp: daysSinceLastMessage >= 7,
        optimalTiming: 7,
        approach: 'value-add',
        toneAdjustment: 'slightly more casual'
      };
    }
  }
}

module.exports = new AIService();
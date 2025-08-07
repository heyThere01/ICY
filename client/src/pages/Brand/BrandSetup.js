import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BrandSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger
  } = useForm({
    defaultValues: {
      name: '',
      industry: '',
      description: '',
      website: '',
      productDetails: {
        category: '',
        priceRange: { min: '', max: '' },
        keyFeatures: [],
        uniqueSellingPoints: []
      },
      targetAudience: {
        ageRange: { min: 18, max: 65 },
        gender: 'all',
        interests: [],
        location: { countries: [], regions: [] }
      },
      brandTone: {
        personality: '',
        communicationStyle: '',
        values: [],
        voiceDescription: ''
      },
      campaignGoals: {
        primary: '',
        budget: { min: '', max: '' },
        timeline: { start: '', end: '' },
        expectedROI: ''
      }
    }
  });

  const industries = [
    'Beauty & Cosmetics', 'Fashion & Apparel', 'Technology', 'Health & Wellness',
    'Food & Beverage', 'Travel & Tourism', 'Fitness', 'Home & Garden',
    'Automotive', 'Finance', 'Education', 'Entertainment'
  ];

  const personalities = [
    { value: 'professional', label: 'Professional', icon: '👔' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'luxury', label: 'Luxury', icon: '✨' },
    { value: 'eco-friendly', label: 'Eco-Friendly', icon: '🌱' },
    { value: 'trendy', label: 'Trendy', icon: '🔥' },
    { value: 'authentic', label: 'Authentic', icon: '💯' },
    { value: 'playful', label: 'Playful', icon: '🎨' }
  ];

  const communicationStyles = [
    { value: 'formal', label: 'Formal', desc: 'Professional and structured' },
    { value: 'conversational', label: 'Conversational', desc: 'Friendly and approachable' },
    { value: 'humorous', label: 'Humorous', desc: 'Light-hearted and fun' },
    { value: 'inspirational', label: 'Inspirational', desc: 'Motivating and uplifting' },
    { value: 'educational', label: 'Educational', desc: 'Informative and helpful' }
  ];

  const campaignGoals = [
    { value: 'brand-awareness', label: 'Brand Awareness', icon: '📢' },
    { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
    { value: 'sales-conversion', label: 'Sales Conversion', icon: '💰' },
    { value: 'engagement', label: 'Engagement', icon: '❤️' },
    { value: 'reach', label: 'Reach', icon: '🌍' }
  ];

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('🎉 Brand setup completed! AI analysis is generating your personalized recommendations...');
      console.log('Brand Data:', data);
      
      // Here you would typically:
      // 1. Send data to your backend API
      // 2. Trigger AI analysis
      // 3. Redirect to dashboard or next step
      
    } catch (error) {
      toast.error('Failed to save brand setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = [
    'Basic Information',
    'Target Audience',
    'Brand Personality',
    'Campaign Goals'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <BuildingOfficeIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your brand</h2>
              <p className="text-pink-600">Let's start with the basics to understand your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  {...register('name', { required: 'Brand name is required' })}
                  className="input-field"
                  placeholder="Enter your brand name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  {...register('industry', { required: 'Industry is required' })}
                  className="select-field"
                >
                  <option value="">Select your industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="textarea-field"
                placeholder="Describe your brand, products, and what makes you unique..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                {...register('website')}
                className="input-field"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <UsersIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Who is your target audience?</h2>
              <p className="text-pink-600">Help us understand who you want to reach</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    {...register('targetAudience.ageRange.min', { min: 13, max: 100 })}
                    type="number"
                    className="input-field"
                    placeholder="Min age"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    {...register('targetAudience.ageRange.max', { min: 13, max: 100 })}
                    type="number"
                    className="input-field"
                    placeholder="Max age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Focus
                </label>
                <select
                  {...register('targetAudience.gender')}
                  className="select-field"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests & Hobbies
              </label>
              <input
                {...register('targetAudience.interests')}
                className="input-field"
                placeholder="Enter interests separated by commas (e.g., fitness, beauty, technology)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Locations
              </label>
              <input
                {...register('targetAudience.location.countries')}
                className="input-field"
                placeholder="Enter countries/regions (e.g., United States, Europe, Global)"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <HeartIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your brand personality?</h2>
              <p className="text-pink-600">Define your brand's voice and values</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Brand Personality *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {personalities.map(personality => (
                  <label key={personality.value} className="relative cursor-pointer">
                    <input
                      {...register('brandTone.personality', { required: 'Please select a personality' })}
                      type="radio"
                      value={personality.value}
                      className="sr-only"
                    />
                    <div className="card-glass border-2 border-transparent hover:border-pink-300 transition-all duration-200 p-4 text-center">
                      <div className="text-2xl mb-2">{personality.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{personality.label}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.brandTone?.personality && (
                <p className="mt-2 text-sm text-red-600">{errors.brandTone.personality.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Communication Style *
              </label>
              <div className="space-y-3">
                {communicationStyles.map(style => (
                  <label key={style.value} className="relative cursor-pointer">
                    <input
                      {...register('brandTone.communicationStyle', { required: 'Please select a communication style' })}
                      type="radio"
                      value={style.value}
                      className="sr-only"
                    />
                    <div className="card-glass border-2 border-transparent hover:border-pink-300 transition-all duration-200 p-4 flex items-center space-x-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{style.label}</div>
                        <div className="text-sm text-gray-600">{style.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.brandTone?.communicationStyle && (
                <p className="mt-2 text-sm text-red-600">{errors.brandTone.communicationStyle.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Values
              </label>
              <input
                {...register('brandTone.values')}
                className="input-field"
                placeholder="Enter your core values (e.g., sustainability, innovation, quality)"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <LightBulbIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your campaign goals?</h2>
              <p className="text-pink-600">Set your objectives and budget for influencer campaigns</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Primary Goal *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {campaignGoals.map(goal => (
                  <label key={goal.value} className="relative cursor-pointer">
                    <input
                      {...register('campaignGoals.primary', { required: 'Please select a primary goal' })}
                      type="radio"
                      value={goal.value}
                      className="sr-only"
                    />
                    <div className="card-glass border-2 border-transparent hover:border-pink-300 transition-all duration-200 p-4 text-center">
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{goal.label}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.campaignGoals?.primary && (
                <p className="mt-2 text-sm text-red-600">{errors.campaignGoals.primary.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range (USD)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  {...register('campaignGoals.budget.min')}
                  type="number"
                  className="input-field"
                  placeholder="Minimum budget"
                />
                <input
                  {...register('campaignGoals.budget.max')}
                  type="number"
                  className="input-field"
                  placeholder="Maximum budget"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Timeline
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  {...register('campaignGoals.timeline.start')}
                  type="date"
                  className="input-field"
                />
                <input
                  {...register('campaignGoals.timeline.end')}
                  type="date"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected ROI
              </label>
              <select
                {...register('campaignGoals.expectedROI')}
                className="select-field"
              >
                <option value="">Select expected ROI</option>
                <option value="2x">2x Return</option>
                <option value="3x">3x Return</option>
                <option value="5x">5x Return</option>
                <option value="10x">10x+ Return</option>
              </select>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gradient font-display">Brand Setup</h1>
          <div className="text-sm text-pink-600 font-medium">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 border-pink-500 text-white' 
                  : 'border-pink-200 text-pink-300'
              }`}>
                {step < currentStep ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              {step < totalSteps && (
                <div className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  step < currentStep ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-pink-100'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-pink-600 font-medium">
          {stepTitles.map((title, index) => (
            <div key={index} className="text-center" style={{ width: '120px' }}>
              {title}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-glass border border-pink-100 p-8 mb-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Setting up your brand...</span>
                </div>
              ) : (
                <span className="flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Complete Setup</span>
                </span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BrandSetup;
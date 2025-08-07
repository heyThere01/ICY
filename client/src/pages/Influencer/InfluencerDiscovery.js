import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, UsersIcon, SparklesIcon } from '@heroicons/react/24/outline';

const InfluencerDiscovery = () => {
  const mockInfluencers = [
    { id: 1, name: 'Sarah Beauty', followers: '2.3M', engagement: '4.8%', category: 'Beauty', avatar: '👩🏻‍💄' },
    { id: 2, name: 'Tech Mike', followers: '1.8M', engagement: '3.2%', category: 'Tech', avatar: '👨🏻‍💻' },
    { id: 3, name: 'Fashion Emma', followers: '3.1M', engagement: '5.1%', category: 'Fashion', avatar: '👩🏼‍🎨' },
    { id: 4, name: 'Lifestyle Joe', followers: '950K', engagement: '6.2%', category: 'Lifestyle', avatar: '🧘🏻‍♂️' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient font-display">Discover Influencers</h1>
          <p className="mt-2 text-pink-600">Find the perfect creators for your brand campaigns</p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <SparklesIcon className="w-4 h-4 mr-2" />
          AI Discovery
        </button>
      </motion.div>

      {/* Search and Filters */}
      <div className="card-glass border border-pink-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
            <input
              type="text"
              placeholder="Search influencers by name, category, or keywords..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="select-field">
              <option>All Categories</option>
              <option>Beauty</option>
              <option>Fashion</option>
              <option>Tech</option>
              <option>Lifestyle</option>
            </select>
            <select className="select-field">
              <option>All Tiers</option>
              <option>Nano (1K-10K)</option>
              <option>Micro (10K-100K)</option>
              <option>Macro (100K-1M)</option>
              <option>Mega (1M+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Influencer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockInfluencers.map((influencer, index) => (
          <motion.div
            key={influencer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-influencer"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center text-2xl">
                {influencer.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
                <p className="text-sm text-pink-600">{influencer.category}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">{influencer.followers} followers</span>
                  <span className="text-sm text-green-600">{influencer.engagement} engagement</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Brand Fit Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-pink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary flex-1 text-sm py-2">
                  View Profile
                </button>
                <button className="btn-secondary flex-1 text-sm py-2">
                  Add to Campaign
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerDiscovery;
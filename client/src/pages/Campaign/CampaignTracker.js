import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

const CampaignTracker = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <ChartBarIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gradient font-display mb-2">Campaign Tracker</h1>
        <p className="text-pink-600 mb-8">Real-time campaign analytics and performance tracking coming soon!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="card-glass p-6 border border-pink-100">
            <TrendingUpIcon className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Analytics</h3>
            <p className="text-sm text-gray-600">Real-time campaign performance metrics</p>
          </div>
          <div className="card-glass p-6 border border-pink-100">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Goal Tracking</h3>
            <p className="text-sm text-gray-600">Monitor campaign objectives and KPIs</p>
          </div>
          <div className="card-glass p-6 border border-pink-100">
            <div className="text-2xl mb-3">🎉</div>
            <h3 className="font-semibold text-gray-900 mb-2">Success Metrics</h3>
            <p className="text-sm text-gray-600">Track collaboration success rates</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignTracker;
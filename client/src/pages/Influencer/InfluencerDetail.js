import React from 'react';
import { motion } from 'framer-motion';

const InfluencerDetail = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">👩🏻‍💄</div>
        <h1 className="text-3xl font-bold text-gradient font-display mb-2">Influencer Detail Page</h1>
        <p className="text-pink-600 mb-8">Detailed analytics, audience insights, and AI persona analysis coming soon!</p>
        <div className="flex justify-center space-x-4">
          <div className="card-glass p-4 border border-pink-100">
            <h3 className="font-semibold text-gray-900">Stats Tab</h3>
            <p className="text-sm text-gray-600">Engagement metrics</p>
          </div>
          <div className="card-glass p-4 border border-pink-100">
            <h3 className="font-semibold text-gray-900">Audience Tab</h3>
            <p className="text-sm text-gray-600">Demographics analysis</p>
          </div>
          <div className="card-glass p-4 border border-pink-100">
            <h3 className="font-semibold text-gray-900">AI Persona</h3>
            <p className="text-sm text-gray-600">AI-generated insights</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerDetail;
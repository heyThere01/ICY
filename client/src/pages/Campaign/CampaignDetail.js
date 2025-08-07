import React from 'react';
import { motion } from 'framer-motion';

const CampaignDetail = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-3xl font-bold text-gradient font-display mb-2">Campaign Detail</h1>
        <p className="text-pink-600">Detailed campaign management and analytics coming soon!</p>
      </motion.div>
    </div>
  );
};

export default CampaignDetail;
import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const MessageGenerator = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <SparklesIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gradient font-display mb-2">AI Message Generator</h1>
        <p className="text-pink-600 mb-8">Personalized outreach messages powered by OpenAI GPT coming soon!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="card-glass p-6 border border-pink-100">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Smart Personalization</h3>
            <p className="text-sm text-gray-600">AI analyzes influencer content to create personalized messages</p>
          </div>
          <div className="card-glass p-6 border border-pink-100">
            <SparklesIcon className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Tone Analysis</h3>
            <p className="text-sm text-gray-600">Adjusts message tone based on brand personality and influencer style</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageGenerator;
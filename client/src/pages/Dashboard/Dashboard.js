import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  HeartIcon,
  SparklesIcon,
  EyeIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock data for demonstration
  const stats = [
    {
      name: 'Total Influencers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Active Campaigns',
      value: '23',
      change: '+3',
      changeType: 'increase',
      icon: ChartBarSquareIcon,
      color: 'from-rose-500 to-pink-600'
    },
    {
      name: 'Messages Sent',
      value: '1,245',
      change: '+8.2%',
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-pink-600 to-rose-600'
    },
    {
      name: 'Total Budget',
      value: '$45,230',
      change: '-2.4%',
      changeType: 'decrease',
      icon: CurrencyDollarIcon,
      color: 'from-rose-600 to-pink-700'
    }
  ];

  const engagementData = [
    { date: 'Mon', engagement: 4200, reach: 12000 },
    { date: 'Tue', engagement: 5800, reach: 15000 },
    { date: 'Wed', engagement: 3900, reach: 11000 },
    { date: 'Thu', engagement: 6700, reach: 18000 },
    { date: 'Fri', engagement: 8200, reach: 22000 },
    { date: 'Sat', engagement: 7500, reach: 19000 },
    { date: 'Sun', engagement: 6800, reach: 17000 }
  ];

  const campaignData = [
    { name: 'Beauty Products', value: 35, color: '#ec4899' },
    { name: 'Fashion', value: 28, color: '#f43f5e' },
    { name: 'Tech', value: 20, color: '#f59066' },
    { name: 'Lifestyle', value: 17, color: '#ab7c6b' }
  ];

  const topInfluencers = [
    { name: 'Sarah Beauty', followers: '2.3M', engagement: '4.8%', avatar: '👩🏻‍💄', category: 'Beauty' },
    { name: 'Tech Mike', followers: '1.8M', engagement: '3.2%', avatar: '👨🏻‍💻', category: 'Tech' },
    { name: 'Fashion Emma', followers: '3.1M', engagement: '5.1%', avatar: '👩🏼‍🎨', category: 'Fashion' },
    { name: 'Lifestyle Joe', followers: '950K', engagement: '6.2%', avatar: '🧘🏻‍♂️', category: 'Lifestyle' }
  ];

  const recentActivities = [
    { action: 'New campaign launched', time: '2 minutes ago', icon: '🚀' },
    { action: 'Message response received', time: '15 minutes ago', icon: '💬' },
    { action: 'Influencer contract signed', time: '1 hour ago', icon: '✍️' },
    { action: 'Payment processed', time: '3 hours ago', icon: '💳' },
    { action: 'New influencer added', time: '5 hours ago', icon: '👤' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Welcome back, <span className="text-gradient">{user?.firstName}</span>! 
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block ml-2"
            >
              👋
            </motion.span>
          </h1>
          <p className="mt-2 text-pink-600">
            Here's what's happening with your influencer campaigns today.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select-field text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>
          <button className="btn-primary">
            <SparklesIcon className="w-4 h-4 mr-2" />
            New Campaign
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card group hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2 space-x-1">
                  {stat.changeType === 'increase' ? (
                    <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 card-glass border border-pink-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Overview</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-600">Engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                <span className="text-gray-600">Reach</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
              <XAxis dataKey="date" stroke="#ec4899" fontSize={12} />
              <YAxis stroke="#ec4899" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #f9a8d4',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#ec4899" 
                strokeWidth={3}
                dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#be185d' }}
              />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="#f43f5e" 
                strokeWidth={3}
                dot={{ fill: '#f43f5e', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#be123c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Campaign Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="card-glass border border-pink-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Distribution</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={campaignData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {campaignData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #f9a8d4',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-2 mt-4">
            {campaignData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Influencers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="card-glass border border-pink-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Influencers</h3>
            <button className="btn-ghost text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {topInfluencers.map((influencer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">
                    {influencer.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{influencer.name}</p>
                    <p className="text-sm text-pink-600">{influencer.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{influencer.followers}</p>
                  <p className="text-sm text-green-600">{influencer.engagement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="card-glass border border-pink-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="btn-ghost text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-pink-50 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center text-sm">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-pink-600">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
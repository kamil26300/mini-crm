import asyncHandler from 'express-async-handler';
import Customer from '../models/Customer.js';
import Campaign from '../models/Campaign.js';
import Message from '../models/Message.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Public
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Total Customers
    const totalCustomers = await Customer.countDocuments();

    // Active Campaigns
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });

    // Message Success Rate
    const totalMessages = await Message.countDocuments();
    const successfulMessages = await Message.countDocuments({ status: 'sent' });
    const messageSuccessRate = totalMessages
      ? ((successfulMessages / totalMessages) * 100).toFixed(2)
      : 0;

    // Failed Deliveries
    const failedDeliveries = await Message.countDocuments({ status: 'failed' });

    const stats = {
      totalCustomers,
      completedCampaigns,
      messageSuccessRate,
      failedDeliveries,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching dashboard stats');
  }
});

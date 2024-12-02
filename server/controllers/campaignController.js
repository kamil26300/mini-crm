import asyncHandler from "express-async-handler";
import Campaign from "../models/Campaign.js";
import Customer from "../models/Customer.js";
import Message from "../models/Message.js";

let messageQueue = [];// Initialize an in-memory queue

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({});
  res.json(campaigns);
});

// @desc    Create a campaign
// @route   POST /api/campaigns
// @access  Public
export const createCampaign = asyncHandler(async (req, res) => {
  const { name, messageTemplate, conditions } = req.body;

  const campaign = await Campaign.create({
    name,
    messageTemplate,
    conditions,
  });

  // Calculate audience size
  const audienceSize = await calculateAudienceSize(conditions);
  campaign.audienceSize = audienceSize;
  await campaign.save();

  res.status(201).json(campaign);
});

// @desc    Calculate audience size
// @route   POST /api/campaigns/calculate-audience
// @access  Public
export const calculateAudienceSize = asyncHandler(async (conditions) => {
  let query = {};

  conditions.forEach((condition, index) => {
    const { field, operator, value, conjunction } = condition;

    let operatorQuery = {};
    switch (operator) {
      case "gt":
        operatorQuery = { $gt: value };
        break;
      case "lt":
        operatorQuery = { $lt: value };
        break;
      case "eq":
        operatorQuery = { $eq: value };
        break;
      case "gte":
        operatorQuery = { $gte: value };
        break;
      case "lte":
        operatorQuery = { $lte: value };
        break;
    }

    if (index === 0) {
      query[field] = operatorQuery;
    } else {
      if (conjunction === "AND") {
        query[field] = { ...query[field], ...operatorQuery };
      } else {
        query = {
          $or: [query, { [field]: operatorQuery }],
        };
      }
    }
  });

  const count = await Customer.countDocuments(query);
  return count;
});

// @desc    Send campaign messages
// @route   POST /api/campaigns/:id/send
// @access  Public
export const sendCampaignMessages = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found");
  }

  // Update campaign status to 'running'
  campaign.status = "running";
  campaign.stats = { sent: 0, failed: 0 }; // Reset stats
  await campaign.save();

  // Get matching customers
  const customers = await getMatchingCustomers(campaign.conditions);

  // Add messages to the queue
  customers.forEach((customer) => {
    const content = campaign.messageTemplate.replace("[Name]", customer.name);
    messageQueue.push({
      campaignId: campaign._id,
      customerId: customer._id,
      content,
    });
  });

  // Respond to client immediately
  res.json({ message: "Messages queued for sending", stats: campaign.stats });

  // Process the queue asynchronously
  processQueue(campaign._id);
});

export const getMatchingCustomers = async (conditions) => {
  let query = {};

  conditions.forEach((condition, index) => {
    const { field, operator, value, conjunction } = condition;

    let operatorQuery = {};
    switch (operator) {
      case "gt":
        operatorQuery = { $gt: value };
        break;
      case "lt":
        operatorQuery = { $lt: value };
        break;
      case "eq":
        operatorQuery = { $eq: value };
        break;
      case "gte":
        operatorQuery = { $gte: value };
        break;
      case "lte":
        operatorQuery = { $lte: value };
        break;
    }

    if (index === 0) {
      // First condition initializes the query
      query[field] = operatorQuery;
    } else {
      if (conjunction === "AND") {
        // Add condition with AND logic
        query[field] = { ...query[field], ...operatorQuery };
      } else {
        // Add condition with OR logic
        query = {
          $or: [query, { [field]: operatorQuery }],
        };
      }
    }
  });

  // Query the Customer collection based on the built query
  const matchingCustomers = await Customer.find(query);
  return matchingCustomers;
};

// Process the message queue
const processQueue = async (campaignId) => {
  while (messageQueue.length > 0) {
    const messageData = messageQueue.shift();
    console.log(`Sending message: ${messageData.content}`);

    try {
      // Simulate message sending with 90% success rate
      const success = Math.random() < 0.9;

      await Message.create({
        campaign: messageData.campaignId,
        customer: messageData.customerId,
        content: messageData.content,
        status: success ? "sent" : "failed",
      });

      // Update campaign stats
      const campaign = await Campaign.findById(messageData.campaignId);
      if (success) {
        campaign.stats.sent += 1;
      } else {
        campaign.stats.failed += 1;
      }
      await campaign.save();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  // Once the queue is empty, update the campaign status to 'completed'
  const campaign = await Campaign.findById(campaignId);
  if (campaign) {
    campaign.status = "completed";
    await campaign.save();
    console.log(`Campaign ${campaign.name} completed`);
  }
};

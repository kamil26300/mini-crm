import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Route for fetching dashboard stats
router.get('/', getDashboardStats);

export default router;

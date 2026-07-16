import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Achievement } from '../models/Achievement.model.js';
import { User } from '../models/User.model.js';

const router = Router();

// Get all achievements
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const achievements = await Achievement.find();

    res.json({
      success: true,
      achievements,
    });
  })
);

// Get user achievements
router.get(
  '/user/me',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('achievements');

    res.json({
      success: true,
      achievements: user?.achievements || [],
    });
  })
);

export default router;
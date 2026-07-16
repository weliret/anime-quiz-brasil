import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { User } from '../models/User.model.js';
import { QuizHistory } from '../models/QuizHistory.model.js';

const router = Router();

// Get global ranking
router.get(
  '/global',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, period = 'all' } = req.query;

    let startDate = new Date(0);
    if (period === 'daily') {
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    } else if (period === 'weekly') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'monthly') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Aggregation pipeline para calcular scores
    const rankings = await QuizHistory.aggregate([
      {
        $match: {
          completedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          quizzesCompleted: { $sum: 1 },
          averageScore: { $avg: '$score' },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: 1,
            username: 1,
            avatar: 1,
            level: 1,
          },
          totalScore: 1,
          totalPoints: 1,
          quizzesCompleted: 1,
          averageScore: 1,
        },
      },
    ]);

    const total = await User.countDocuments();

    res.json({
      success: true,
      rankings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// Get category ranking
router.get(
  '/:category',
  asyncHandler(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const rankings = await QuizHistory.aggregate([
      {
        $match: {
          category,
        },
      },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          quizzesCompleted: { $sum: 1 },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);

    res.json({
      success: true,
      rankings,
    });
  })
);

export default router;
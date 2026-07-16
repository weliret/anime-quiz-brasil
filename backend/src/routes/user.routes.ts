import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { User } from '../models/User.model.js';
import { QuizHistory } from '../models/QuizHistory.model.js';

const router = Router();

// Get user profile
router.get(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate('badges')
      .populate('achievements');

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    res.json({
      success: true,
      user,
    });
  })
);

// Get user statistics
router.get(
  '/stats',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const history = await QuizHistory.find({ userId: req.user.id });

    const stats = {
      totalQuizzes: user.totalQuizzes,
      correctAnswers: user.correctAnswers,
      accuracy: user.totalQuizzes > 0 ? (user.correctAnswers / (user.totalQuizzes * 10)) * 100 : 0,
      averageScore: history.length > 0 ? history.reduce((acc, h) => acc + h.score, 0) / history.length : 0,
      streak: user.streak,
      xp: user.xp,
      level: user.level,
    };

    res.json({ success: true, stats });
  })
);

// Get user history
router.get(
  '/history',
  protect,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category } = req.query;

    const query: any = { userId: req.user.id };
    if (category) query.category = category;

    const history = await QuizHistory.find(query)
      .sort({ completedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('quizId', 'title category');

    const total = await QuizHistory.countDocuments(query);

    res.json({
      success: true,
      history,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// Update profile
router.patch(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const { username, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        throw new AppError(400, 'Nome de usuário já está em uso');
      }
      user.username = username;
    }

    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user,
    });
  })
);

// Add friend
router.post(
  '/friends/:userId',
  protect,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(req.user.id);
    const friend = await User.findById(userId);

    if (!friend) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    if (user!.friends.includes(friend._id)) {
      throw new AppError(400, 'Usuário já está na sua lista de amigos');
    }

    user!.friends.push(friend._id);
    await user!.save();

    res.json({
      success: true,
      message: 'Amigo adicionado com sucesso',
    });
  })
);

// Remove friend
router.delete(
  '/friends/:userId',
  protect,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(req.user.id);
    user!.friends = user!.friends.filter((id) => id.toString() !== userId);
    await user!.save();

    res.json({
      success: true,
      message: 'Amigo removido com sucesso',
    });
  })
);

export default router;
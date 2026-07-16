import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { Quiz } from '../models/Quiz.model.js';
import { User } from '../models/User.model.js';

const router = Router();

// Approve quiz
router.patch(
  '/quizzes/:id/approve',
  protect,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    res.json({
      success: true,
      message: 'Quiz aprovado com sucesso',
      quiz,
    });
  })
);

// Reject quiz
router.patch(
  '/quizzes/:id/reject',
  protect,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    res.json({
      success: true,
      message: 'Quiz rejeitado',
      quiz,
    });
  })
);

// Ban user
router.patch(
  '/users/:id/ban',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'banned' },
      { new: true }
    );

    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    res.json({
      success: true,
      message: 'Usuário banido com sucesso',
      user,
    });
  })
);

// Get pending quizzes
router.get(
  '/quizzes/pending',
  protect,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ status: 'pending' }).populate('creator', 'username email');

    res.json({
      success: true,
      quizzes,
      total: quizzes.length,
    });
  })
);

export default router;
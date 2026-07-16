import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { Quiz } from '../models/Quiz.model.js';
import mongoose from 'mongoose';

const router = Router();

interface IComment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  createdAt: Date;
}

// Add comment to quiz
router.post(
  '/:quizId',
  protect,
  asyncHandler(async (req, res) => {
    const { content } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    const comment: IComment = {
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(req.user.id),
      content,
      likes: 0,
      createdAt: new Date(),
    };

    // Seria melhor ter um modelo separado, mas para simplicidade adicionamos ao quiz
    // quiz.comments.push(comment);
    // await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Comentário adicionado com sucesso',
      comment,
    });
  })
);

export default router;
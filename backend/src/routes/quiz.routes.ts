import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { Quiz } from '../models/Quiz.model.js';
import { QuizHistory } from '../models/QuizHistory.model.js';
import { User } from '../models/User.model.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Get quizzes with filters
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, category, difficulty, search, sort = '-createdAt' } = req.query;

    const query: any = { status: 'approved' };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search as string };
    }

    const quizzes = await Quiz.find(query)
      .sort(sort as string)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('creator', 'username avatar');

    const total = await Quiz.countDocuments(query);

    res.json({
      success: true,
      quizzes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// Get single quiz
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('comments');

    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    // Incrementar views
    quiz.plays = (quiz.plays || 0) + 1;
    await quiz.save();

    res.json({ success: true, quiz });
  })
);

// Create quiz
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Título é obrigatório'),
    body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
    body('category').isIn(['naruto', 'one-piece', 'dragon-ball', 'bleach', 'solo-leveling', 'demon-slayer', 'jujutsu-kaisen', 'attack-on-titan', 'chainsaw-man', 'pokemon', 'outros']).withMessage('Categoria inválida'),
    body('questions').isArray({ min: 5 }).withMessage('Mínimo de 5 questões'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, questions, difficulty, timeLimit, tags } = req.body;

    const quiz = new Quiz({
      title,
      description,
      category,
      questions,
      difficulty,
      timeLimit,
      tags,
      totalQuestions: questions.length,
      creator: req.user.id,
      status: 'pending', // Precisa de aprovação
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz criado com sucesso. Aguardando aprovação dos moderadores.',
      quiz,
    });
  })
);

// Submit quiz answer
router.post(
  '/:id/submit',
  protect,
  asyncHandler(async (req, res) => {
    const { answers, duration } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    let correctCount = 0;
    const processedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index];
      const selectedOption = question.options[answer.selectedOption];
      const isCorrect = selectedOption?.isCorrect || false;

      if (isCorrect) correctCount++;

      return {
        questionId: index,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeSpent: answer.timeSpent,
      };
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const totalPoints = Math.floor((correctCount / quiz.questions.length) * 1000);
    const xpMultiplier = quiz.difficulty === 'easy' ? 1 : quiz.difficulty === 'medium' ? 1.5 : quiz.difficulty === 'hard' ? 2 : 3;
    const xpEarned = Math.floor(totalPoints * xpMultiplier);

    // Salvar histórico
    const history = new QuizHistory({
      userId: req.user.id,
      quizId: quiz._id,
      score,
      totalPoints,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      answers: processedAnswers,
      duration,
      difficulty: quiz.difficulty,
      xpEarned,
      completedAt: new Date(),
    });

    await history.save();

    // Atualizar stats do usuário
    const user = await User.findById(req.user.id);
    if (user) {
      user.totalQuizzes = (user.totalQuizzes || 0) + 1;
      user.correctAnswers = (user.correctAnswers || 0) + correctCount;
      user.xp = (user.xp || 0) + xpEarned;
      user.points = (user.points || 0) + totalPoints;

      // Calcular nível (a cada 10.000 XP = 1 nível)
      user.level = Math.floor(user.xp / 10000) + 1;

      await user.save();
    }

    // Atualizar stats do quiz
    quiz.attempts = (quiz.attempts || 0) + 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.attempts - 1)) + score) / quiz.attempts;
    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz completado com sucesso',
      result: {
        score,
        totalPoints,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length,
        xpEarned,
        newLevel: user?.level,
      },
    });
  })
);

// Favorite quiz
router.post(
  '/:id/favorite',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      throw new AppError(404, 'Quiz não encontrado');
    }

    if (user!.favoriteQuizzes.includes(quiz._id)) {
      throw new AppError(400, 'Quiz já está nos favoritos');
    }

    user!.favoriteQuizzes.push(quiz._id);
    quiz.favorites = (quiz.favorites || 0) + 1;

    await user!.save();
    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz adicionado aos favoritos',
    });
  })
);

export default router;
import mongoose, { Schema, Document } from 'mongoose';

interface IQuizHistory extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  duration: number; // em segundos
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  xpEarned: number;
  achievement: string;
  completedAt: Date;
}

const QuizHistorySchema = new Schema<IQuizHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [
      {
        questionId: String,
        selectedOption: Number,
        isCorrect: Boolean,
        timeSpent: Number,
      },
    ],
    duration: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'extreme'],
    },
    xpEarned: { type: Number, default: 0 },
    achievement: String,
    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Índice composto para queries de usuário
QuizHistorySchema.index({ userId: 1, completedAt: -1 });
QuizHistorySchema.index({ quizId: 1, completedAt: -1 });

export const QuizHistory = mongoose.model<IQuizHistory>('QuizHistory', QuizHistorySchema);
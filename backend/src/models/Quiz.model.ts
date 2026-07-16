import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion extends Document {
  question: string;
  description?: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

interface IQuiz extends Document {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  creator: mongoose.Types.ObjectId;
  thumbnail: string;
  questions: IQuestion[];
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  timeLimit?: number; // em segundos
  totalTime: number;
  totalQuestions: number;
  tags: string[];
  passingScore: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
  visibility: 'public' | 'private' | 'friends';
  attempts: number;
  plays: number;
  averageScore: number;
  likes: number;
  favorites: number;
  reports: number;
  comments: mongoose.Types.ObjectId[];
  reviews: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      maxlength: [200, 'Título pode ter no máximo 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      maxlength: [1000, 'Descrição pode ter no máximo 1000 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      enum: [
        'naruto',
        'one-piece',
        'dragon-ball',
        'bleach',
        'solo-leveling',
        'demon-slayer',
        'jujutsu-kaisen',
        'attack-on-titan',
        'chainsaw-man',
        'pokemon',
        'outros',
      ],
    },
    subcategory: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=Quiz',
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        description: String,
        options: [
          {
            text: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        explanation: String,
        imageUrl: String,
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard', 'extreme'],
          default: 'medium',
        },
      },
    ],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'extreme'],
      default: 'medium',
    },
    timeLimit: Number,
    totalTime: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    tags: [String],
    passingScore: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public',
    },
    attempts: { type: Number, default: 0 },
    plays: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Índices para performance
QuizSchema.index({ category: 1, status: 1 });
QuizSchema.index({ creator: 1 });
QuizSchema.index({ createdAt: -1 });
QuizSchema.index({ plays: -1 });
QuizSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
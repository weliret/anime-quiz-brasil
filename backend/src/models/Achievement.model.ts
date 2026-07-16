import mongoose, { Schema, Document } from 'mongoose';

interface IAchievement extends Document {
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'quiz_count' | 'score' | 'streak' | 'category' | 'friends' | 'time';
    value: number;
    category?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    requirement: {
      type: {
        type: String,
        enum: ['quiz_count', 'score', 'streak', 'category', 'friends', 'time'],
        required: true,
      },
      value: { type: Number, required: true },
      category: String,
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    xpReward: { type: Number, default: 0 },
    unlockedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
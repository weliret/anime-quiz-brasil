import mongoose, { Schema, Document } from 'mongoose';
import { hash, verify } from 'argon2';

interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  points: number;
  totalQuizzes: number;
  correctAnswers: number;
  streak: number;
  badges: mongoose.Types.ObjectId[];
  achievements: mongoose.Types.ObjectId[];
  favoriteQuizzes: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  premiumUntil?: Date;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(): Promise<void>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Nome de usuário é obrigatório'],
      unique: true,
      trim: true,
      minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
      maxlength: [30, 'Nome pode ter no máximo 30 caracteres'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Nome deve conter apenas letras, números, _ e -'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
    },
    password: {
      type: String,
      select: false,
      minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
    },
    googleId: String,
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150?text=Avatar',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio pode ter no máximo 500 caracteres'],
      default: '',
    },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
    favoriteQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { select: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { select: false },
    verificationTokenExpiry: { select: false },
    passwordResetToken: { select: false },
    passwordResetTokenExpiry: { select: false },
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    premiumUntil: Date,
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Hash senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    if (this.password) {
      this.password = await hash(this.password, {
        type: 2,
        timeCost: 3,
        memoryCost: 4096,
        parallelism: 1,
      });
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return verify(this.password, password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
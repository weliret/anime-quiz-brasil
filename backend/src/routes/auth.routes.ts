import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';
import { User } from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const router = Router();

// Validações
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Nome deve ter entre 3 e 30 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Nome deve conter apenas letras, números, _ e -'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Senha deve ter pelo menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'),
];

// Token JWT
const generateToken = (userId: string, expiresIn: string = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || '', { expiresIn });
};

// Register
router.post(
  '/register',
  registerValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new AppError(400, 'Usuário ou email já cadastrado');
    }

    // Criar novo usuário
    const user = new User({
      username,
      email,
      password,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await user.save();

    // TODO: Enviar email de verificação

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  })
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Encontrar usuário
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError(401, 'Email ou senha incorretos');
    }

    // Verificar se conta está bloqueada
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppError(429, 'Conta bloqueada. Tente novamente mais tarde');
    }

    // Comparar senhas
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      }
      await user.save();
      throw new AppError(401, 'Email ou senha incorretos');
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Verificar 2FA
    if (user.twoFactorEnabled) {
      return res.json({
        success: true,
        message: 'Confirme o código 2FA',
        requires2FA: true,
        tempToken: generateToken(user._id.toString(), '5m'),
      });
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        role: user.role,
      },
    });
  })
);

// Setup 2FA
router.post(
  '/2fa/setup',
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const secret = speakeasy.generateSecret({
      name: `Anime Quiz Brasil (${user.email})`,
      issuer: 'Anime Quiz Brasil',
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    res.json({
      success: true,
      qrCode,
      secret: secret.base32,
    });
  })
);

// Verify 2FA
router.post(
  '/2fa/verify',
  protect,
  asyncHandler(async (req, res) => {
    const { secret, token } = req.body;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new AppError(400, 'Token inválido');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    user.twoFactorEnabled = true;
    user.twoFactorSecret = secret;
    await user.save();

    res.json({
      success: true,
      message: '2FA ativado com sucesso',
    });
  })
);

// Verify 2FA Token on Login
router.post(
  '/2fa/verify-login',
  asyncHandler(async (req, res) => {
    const { token, code } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
      const user = await User.findById(decoded.id).select('+twoFactorSecret');

      if (!user || !user.twoFactorSecret) {
        throw new AppError(400, '2FA não configurado');
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (!verified) {
        throw new AppError(400, 'Código inválido');
      }

      const finalToken = generateToken(user._id.toString());

      res.json({
        success: true,
        message: 'Autenticação realizada com sucesso',
        token: finalToken,
      });
    } catch (error) {
      throw new AppError(401, 'Token inválido ou expirado');
    }
  })
);

// Forgot Password
router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Email inválido'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá instruções de recuperação',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    // TODO: Enviar email com link de recuperação

    res.json({
      success: true,
      message: 'Email de recuperação enviado',
    });
  })
);

// Reset Password
router.post(
  '/reset-password/:token',
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError(400, 'Token inválido ou expirado');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Senha atualizada com sucesso',
    });
  })
);

export default router;
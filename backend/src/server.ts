import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

// Import middleware
import { errorHandler, asyncHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import commentRoutes from './routes/comment.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Import database
import { connectDB } from './config/database.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Middleware de Segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Sanitização
app.use(mongoSanitize());
app.use(hpp());

// Request Logger
app.use(requestLogger);

// Rate Limiting
app.use('/api/', rateLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Error Handler
app.use(errorHandler);

// Socket.io Events
io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  // Quiz eventos
  socket.on('quiz:started', (data) => {
    io.emit('quiz:user_started', data);
  });

  socket.on('quiz:completed', (data) => {
    io.emit('quiz:user_completed', data);
  });

  // Ranking em tempo real
  socket.on('ranking:subscribe', (category) => {
    socket.join(`ranking:${category}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Database Connection
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });

export { app, io };
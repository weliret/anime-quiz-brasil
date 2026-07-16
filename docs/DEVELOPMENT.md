# Anime Quiz Brasil - Guia de Desenvolvimento

## 📋 Índice

1. [Instalação](#instalação)
2. [Desenvolvimento](#desenvolvimento)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [Segurança](#segurança)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- MongoDB Atlas ou MongoDB Local
- Redis (opcional, para cache)
- Git

### Setup Inicial

```bash
# Clone o repositório
git clone https://github.com/weliret/anime-quiz-brasil.git
cd anime-quiz-brasil

# Copie o arquivo de ambiente
cp .env.example .env

# Edite o .env com suas configurações
nano .env

# Instale dependências do backend
cd backend
npm install

# Instale dependências do frontend
cd ../frontend
npm install
```

## 🛠️ Desenvolvimento

### Executar Backend

```bash
cd backend
npm run dev

# O servidor rodará em http://localhost:3000
```

### Executar Frontend

```bash
cd frontend
npm run dev

# A aplicação abrirá em http://localhost:5173
```

### Executar Ambos Simultaneamente

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "seu_username",
  "email": "seu@email.com",
  "password": "SenhaFort3!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "seu_username",
    "email": "seu@email.com",
    "avatar": "...",
    "level": 1,
    "xp": 0
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "SenhaFort3!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "seu_username",
    "email": "seu@email.com",
    "avatar": "...",
    "level": 1,
    "xp": 0,
    "role": "user"
  }
}
```

### Quiz Endpoints

#### Get All Quizzes
```http
GET /api/quizzes?page=1&limit=10&category=naruto&difficulty=easy
```

**Response (200):**
```json
{
  "success": true,
  "quizzes": [
    {
      "_id": "...",
      "title": "Naruto Básico",
      "description": "Quiz sobre fundamentos de Naruto",
      "category": "naruto",
      "difficulty": "easy",
      "plays": 150,
      "averageScore": 78.5,
      "creator": {
        "username": "creator_name",
        "avatar": "..."
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 5
  }
}
```

#### Get Single Quiz
```http
GET /api/quizzes/:id
```

#### Create Quiz (Autenticado)
```http
POST /api/quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Quiz Naruto Intermediário",
  "description": "Teste seus conhecimentos sobre Naruto Shippuden",
  "category": "naruto",
  "difficulty": "medium",
  "timeLimit": 600,
  "questions": [
    {
      "question": "Qual é o nome do Tailed Beast do Naruto?",
      "options": [
        { "text": "Kurama", "isCorrect": true },
        { "text": "Shukaku", "isCorrect": false },
        { "text": "Isobu", "isCorrect": false },
        { "text": "Chomei", "isCorrect": false }
      ],
      "explanation": "Kurama é o Nine-Tailed Fox (Nove Caudas) do Naruto"
    }
  ]
}
```

#### Submit Quiz (Autenticado)
```http
POST /api/quizzes/:id/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    { "selectedOption": 0, "timeSpent": 15 },
    { "selectedOption": 2, "timeSpent": 20 }
  ],
  "duration": 300
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz completado com sucesso",
  "result": {
    "score": 85.5,
    "totalPoints": 855,
    "correctAnswers": 17,
    "totalQuestions": 20,
    "xpEarned": 1282,
    "newLevel": 5
  }
}
```

### User Endpoints

#### Get Profile (Autenticado)
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Get User Stats (Autenticado)
```http
GET /api/users/stats
Authorization: Bearer {token}
```

#### Get User History (Autenticado)
```http
GET /api/users/history?page=1&limit=10&category=naruto
Authorization: Bearer {token}
```

#### Update Profile (Autenticado)
```http
PATCH /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "novo_username",
  "bio": "Otaku apaixonado por anime!",
  "avatar": "https://..."
}
```

### Ranking Endpoints

#### Get Global Ranking
```http
GET /api/rankings/global?page=1&limit=50&period=weekly
```

**Periods:** `daily`, `weekly`, `monthly`, `all`

#### Get Category Ranking
```http
GET /api/rankings/naruto?page=1&limit=50
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, min: 3, max: 30),
  email: String (unique),
  password: String (hashed with Argon2),
  avatar: String (URL),
  bio: String (max: 500),
  level: Number (default: 1),
  xp: Number (default: 0),
  points: Number (default: 0),
  totalQuizzes: Number (default: 0),
  correctAnswers: Number (default: 0),
  streak: Number (default: 0),
  badges: [ObjectId],
  achievements: [ObjectId],
  favoriteQuizzes: [ObjectId],
  friends: [ObjectId],
  blockedUsers: [ObjectId],
  twoFactorEnabled: Boolean (default: false),
  twoFactorSecret: String,
  emailVerified: Boolean (default: false),
  role: String (enum: ['user', 'moderator', 'admin']),
  status: String (enum: ['active', 'suspended', 'banned']),
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  premiumUntil: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (enum: ['naruto', 'one-piece', ...]),
  difficulty: String (enum: ['easy', 'medium', 'hard', 'extreme']),
  creator: ObjectId (ref: User),
  thumbnail: String (URL),
  questions: [
    {
      question: String,
      options: [
        {
          text: String,
          isCorrect: Boolean
        }
      ],
      explanation: String,
      imageUrl: String,
      difficulty: String
    }
  ],
  timeLimit: Number (seconds),
  totalQuestions: Number,
  tags: [String],
  passingScore: Number (default: 60),
  status: String (enum: ['draft', 'pending', 'approved', 'rejected']),
  visibility: String (enum: ['public', 'private', 'friends']),
  attempts: Number (default: 0),
  plays: Number (default: 0),
  averageScore: Number (default: 0),
  likes: Number (default: 0),
  favorites: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### QuizHistory Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  quizId: ObjectId (ref: Quiz),
  score: Number,
  totalPoints: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  answers: [
    {
      questionId: String,
      selectedOption: Number,
      isCorrect: Boolean,
      timeSpent: Number
    }
  ],
  duration: Number (seconds),
  difficulty: String,
  xpEarned: Number,
  achievement: String,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Segurança

### Hash de Senhas

Utilizamos **Argon2** para hash de senhas com as seguintes configurações:

```typescript
hash(password, {
  type: 2,
  timeCost: 3,
  memoryCost: 4096,
  parallelism: 1,
})
```

### JWT Tokens

- **Access Token**: Expira em 7 dias
- **Refresh Token**: Expira em 30 dias
- **2FA Token Temporário**: Expira em 5 minutos

### Headers de Segurança

```typescript
helmet() // Helmet para headers HTTP seguros
mongosanitize() // Previne NoSQL Injection
hpp() // HTTP Parameter Pollution protection
```

### Rate Limiting

- 100 requisições por 15 minutos por IP
- Diferentes limites para endpoints específicos

### CORS

```typescript
cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
})
```

## 🐳 Deployment com Docker

### Build da Imagem

```bash
docker build -f docker/Dockerfile.backend -t anime-quiz-backend .
docker build -f docker/Dockerfile.frontend -t anime-quiz-frontend .
```

### Run com Docker Compose

```bash
docker-compose up -d
```

## 🚨 Troubleshooting

### Erro: MongoDB Connection Refused

**Solução:**
```bash
# Verifique se MongoDB está rodando
mongod --version

# Inicie o MongoDB
mongod
```

### Erro: Port Already in Use

**Solução:**
```bash
# Mude a porta no .env
PORT=3001
```

### Erro: CORS Issues

**Solução:**
```bash
# Verifique o CORS_ORIGIN no .env
CORS_ORIGIN=http://localhost:5173
```

## 📝 Licença

MIT License - veja LICENSE para detalhes.

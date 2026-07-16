# 🎯 Quick Start Guide

## 5 Minutos para Começar

### Pré-requisitos
- Node.js 18+
- MongoDB Atlas account
- Git

### Setup

```bash
# 1. Clone
git clone https://github.com/weliret/anime-quiz-brasil.git
cd anime-quiz-brasil

# 2. Copie ambiente
cp .env.example .env

# 3. Configure .env (mínimo necessário)
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/anime-quiz
JWT_SECRET=sua_chave_super_secreta_aqui
CORS_ORIGIN=http://localhost:5173

# 4. Instale
cd backend && npm install
cd ../frontend && npm install

# 5. Rode
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Acesse
- 🖥️ Frontend: http://localhost:5173
- ⚙️ Backend: http://localhost:3000
- 📊 API: http://localhost:3000/api

### Teste

```bash
# Health check
curl http://localhost:3000/health

# Registre
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"SenhaFort3!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"SenhaFort3!"}'
```

---

## 📁 Estrutura de Pastas Explicada

```
📂 anime-quiz-brasil
 ┣ 📂 backend/          ← Node.js/Express
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 config/       ← Configurações (DB)
 ┃ ┃ ┣ 📂 models/       ← Esquemas MongoDB
 ┃ ┃ ┣ 📂 routes/       ← Endpoints da API
 ┃ ┃ ┣ 📂 middleware/   ← Auth, Errors, Logs
 ┃ ┃ ┗ 📄 server.ts     ← Arquivo principal
 ┃ ┗ 📄 package.json
 ┣ 📂 frontend/         ← React/TypeScript
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 components/   ← Componentes (Navbar, Footer)
 ┃ ┃ ┣ 📂 pages/        ← Páginas (Home, Quiz, Perfil)
 ┃ ┃ ┣ 📂 hooks/        ← Custom hooks (useAuth)
 ┃ ┃ ┣ 📂 styles/       ← CSS global
 ┃ ┃ ┣ 📄 App.tsx       ← App principal
 ┃ ┃ ┗ 📄 main.tsx      ← Entry point
 ┃ ┗ 📄 package.json
 ┣ 📂 docker/           ← Dockerfiles
 ┣ 📂 docs/             ← Documentação
 ┣ 📄 .env.example      ← Variáveis de exemplo
 ┣ 📄 docker-compose.yml← Docker Compose
 ┗ 📄 README.md         ← Este arquivo
```

---

## 🛠️ Comandos Úteis

### Backend

```bash
cd backend

# Desenvolvimento
npm run dev          # Com hot reload

# Build
npm run build        # Compilar TypeScript

# Produção
npm start            # Rodar compilado

# Linting
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente

# Type Check
npm run type-check   # Verificar tipos TypeScript
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev          # Com hot reload

# Build
npm run build        # Otimizado para produção

# Preview
npm run preview      # Visualizar build

# Linting
npm run lint         # Verificar código
```

### Docker

```bash
# Tudo
docker-compose up -d          # Inicia tudo
docker-compose down           # Para tudo
docker-compose logs -f        # Ver logs

# Individual
docker-compose up backend -d  # Só backend
docker-compose up frontend -d # Só frontend
```

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Mude em .env
PORT=3001  # em vez de 3000
```

### "MongoDB connection refused"
```bash
# Verifique MONGODB_URI em .env
# Use MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/anime-quiz
```

### "CORS error"
```bash
# Verifique CORS_ORIGIN em .env
CORS_ORIGIN=http://localhost:5173
```

### "Node modules issues"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Recursos

- 📖 [Documentação Completa](./docs/DEVELOPMENT.md)
- 📡 [API Reference](./docs/API.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🗺️ [Roadmap](./ROADMAP.md)

---

## 🎓 Aprenda

### Primeira Vez?
1. Leia [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
2. Explore a pasta `frontend/src/pages`
3. Veja os endpoints em `backend/src/routes`
4. Modifique algo pequeno e veja acontecer!

### Quer Contribuir?
1. Leia [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Fork o repo
3. Crie uma branch
4. Envie um PR!

---

## 💡 Dicas

✨ **Hotkeys Úteis (VS Code)**
- `Ctrl+Shift+F` - Buscar em todos os arquivos
- `Ctrl+P` - Abrir arquivo rápido
- `Ctrl+Shift+X` - Extensões

✨ **Debug Frontend**
- F12 - Abrir DevTools
- Ctrl+Shift+I - Inspecionar elemento
- `React DevTools` extension

✨ **Debug Backend**
- Adicione `debugger;` no código
- Execute com `node --inspect`
- Acesse `chrome://inspect`

---

**Pronto para começar? 🚀**

Execute os comandos acima e acesse http://localhost:5173!

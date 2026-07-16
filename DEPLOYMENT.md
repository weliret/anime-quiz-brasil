# Anime Quiz Brasil - Deployment Guide

## 🚀 Deploy na Produção

### Opção 1: Heroku

```bash
# Instale Heroku CLI
brewinstall heroku

# Faça login
heroku login

# Crie a app
heroku create seu-app-name

# Configure variáveis de ambiente
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/anime-quiz
heroku config:set JWT_SECRET=sua-chave-secreta

# Deploy
git push heroku main
```

### Opção 2: AWS

#### EC2

```bash
# SSH na instância
ssh -i seu-key.pem ec2-user@seu-ip

# Instale Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs

# Clone o repositório
git clone https://github.com/weliret/anime-quiz-brasil.git
cd anime-quiz-brasil

# Instale dependências
cd backend && npm install
cd ../frontend && npm install && npm run build

# Configure PM2
sudo npm install -g pm2
pm2 start backend/dist/server.js --name "anime-quiz-api"
pm2 startup
pm2 save
```

#### RDS para MongoDB

```bash
# Use MongoDB Atlas em vez de RDS (mais fácil)
# Crie um cluster em https://www.mongodb.com/cloud/atlas
```

#### CloudFront para CDN

```bash
# Configure bucket S3
# Aponte CloudFront para o S3
# Configure CNAME
```

### Opção 3: DigitalOcean

```bash
# Crie um droplet Ubuntu 20.04+
ssh root@seu-ip

# Update system
apt update && apt upgrade -y

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instale MongoDB
apt install -y mongodb

# Instale Nginx
apt install -y nginx

# Clone e configure
git clone https://github.com/weliret/anime-quiz-brasil.git
cd anime-quiz-brasil

# Configure Nginx
sudo cp docker/nginx.conf /etc/nginx/sites-available/anime-quiz
sudo ln -s /etc/nginx/sites-available/anime-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Opção 4: Docker

```bash
# Build images
docker build -f docker/Dockerfile.backend -t anime-quiz-backend .
docker build -f docker/Dockerfile.frontend -t anime-quiz-frontend .

# Push para Docker Hub
docker tag anime-quiz-backend seu-usuario/anime-quiz-backend:latest
docker push seu-usuario/anime-quiz-backend:latest

# Deploy em qualquer host com Docker
docker-compose up -d
```

## 🔒 SSL/HTTPS

### Let's Encrypt com Certbot

```bash
# Instale Certbot
sudo apt install certbot python3-certbot-nginx

# Gere certificado
sudo certbot certonly --nginx -d animequizzbrasil.com

# Configure auto-renewal
sudo systemctl enable certbot.timer
```

## 📊 Monitoring

### PM2 Plus (Monitoring)

```bash
pm2 install pm2-auto-pull
pm2 install pm2-logrotate
pm2 link API_KEY SECRET_KEY
```

### Sentry (Error Tracking)

```bash
# Configure em backend .env
SENTRY_DSN=https://seu-dsn@sentry.io/projeto
```

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          # Seu script de deploy
```

## 🗄️ Backup

### MongoDB Backup

```bash
# Automated backup script
#!/bin/bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/anime-quiz" --out=/backups/$(date +%Y%m%d)

# Upload para S3
aws s3 sync /backups s3://seu-bucket/backups/
```

## 🚨 Health Checks

```bash
# Verifica saúde da API
curl -X GET http://localhost:3000/health
```

## 📈 Performance

### Nginx Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Database Indexing

```javascript
// Índices principais
db.quizzes.createIndex({ category: 1, status: 1 });
db.quizzes.createIndex({ creator: 1 });
db.quizzes.createIndex({ createdAt: -1 });
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
```

## 🔐 Security Checklist

- [ ] HTTPS habilitado
- [ ] JWT secrets seguros
- [ ] Rate limiting configurado
- [ ] CORS whitelist configurado
- [ ] Environment variables seguros
- [ ] Database backups automáticos
- [ ] Logs de segurança habilitados
- [ ] 2FA disponível
- [ ] Email verification obrigatório

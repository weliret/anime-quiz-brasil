# Anime Quiz Brasil - API Reference

## Base URL

```
https://api.animequizzbrasil.com/api
```

## Authentication

Todos os endpoints autenticados requerem o header:

```
Authorization: Bearer {token}
```

## Rate Limiting

- 100 requisições por 15 minutos
- Headers de resposta incluem:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error Response

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": []
}
```

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Endpoints

### Authentication

- `POST /auth/register` - Cadastro
- `POST /auth/login` - Login
- `POST /auth/forgot-password` - Recuperar senha
- `POST /auth/reset-password/:token` - Resetar senha
- `POST /auth/2fa/setup` - Setup 2FA
- `POST /auth/2fa/verify` - Verificar 2FA
- `POST /auth/2fa/verify-login` - Login com 2FA

### Users

- `GET /users/profile` - Perfil do usuário
- `GET /users/stats` - Estatísticas
- `GET /users/history` - Histórico de quizzes
- `PATCH /users/profile` - Atualizar perfil
- `POST /users/friends/:userId` - Adicionar amigo
- `DELETE /users/friends/:userId` - Remover amigo

### Quizzes

- `GET /quizzes` - Listar quizzes
- `GET /quizzes/:id` - Detalhes do quiz
- `POST /quizzes` - Criar quiz
- `POST /quizzes/:id/submit` - Enviar respostas
- `POST /quizzes/:id/favorite` - Favoritar quiz

### Rankings

- `GET /rankings/global` - Ranking global
- `GET /rankings/:category` - Ranking por categoria

### Achievements

- `GET /achievements` - Listar conquistas
- `GET /achievements/user/me` - Minhas conquistas

### Admin

- `PATCH /admin/quizzes/:id/approve` - Aprovar quiz
- `PATCH /admin/quizzes/:id/reject` - Rejeitar quiz
- `PATCH /admin/users/:id/ban` - Banir usuário
- `GET /admin/quizzes/pending` - Quizzes pendentes

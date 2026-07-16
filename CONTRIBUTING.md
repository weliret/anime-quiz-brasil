# Anime Quiz Brasil - Contributing Guide

## Como Contribuir

### 1. Fork o Repositório

```bash
git clone https://github.com/seu-usuario/anime-quiz-brasil.git
cd anime-quiz-brasil
git remote add upstream https://github.com/weliret/anime-quiz-brasil.git
```

### 2. Crie uma Branch

```bash
git checkout -b feature/sua-feature
# ou
git checkout -b bugfix/seu-bug
```

### 3. Faça as Mudanças

```bash
# Trabalhe em suas mudanças
git add .
git commit -m "feat: descrição da sua feature"
```

### 4. Padrão de Commits

Usamos Conventional Commits:

```
feat: adiciona nova feature
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona testes
perf: melhorias de performance
chore: mudanças em build, dependências, etc
```

### 5. Push e Pull Request

```bash
git push origin feature/sua-feature
```

Abra um Pull Request no GitHub com:
- Descrição clara das mudanças
- Referência a issues relacionadas
- Screenshots se aplicável

## Guidelines de Código

### TypeScript

- Use `strict: true` no tsconfig.json
- Sempre adicione tipos explícitos
- Evite usar `any`

```typescript
// ✅ Bom
const handleSubmit = async (data: QuizAnswers): Promise<Result> => {
  // ...
};

// ❌ Ruim
const handleSubmit = async (data: any) => {
  // ...
};
```

### Componentes React

- Use Functional Components com Hooks
- Nomeie componentes com PascalCase
- Coloque componentes em pastas com `index.tsx`

```typescript
// ✅ Bom
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// ❌ Ruim
function myComponent(props) {
  return <div>{props.prop1}</div>;
}
```

### Styling

- Use Tailwind CSS para estilos
- Use classes customizadas para estilos complexos
- Evite estilos inline

```typescript
// ✅ Bom
<div className="bg-dark-800 border border-dark-700 rounded-lg p-4" />

// ❌ Ruim
<div style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
```

## Testes

```bash
# Executar testes
npm test

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Lint e Format

```bash
# Lint
npm run lint

# Fix automatic issues
npm run lint:fix

# Format com Prettier (se configurado)
npm run format
```

## Deploy Preview

Todos os PRs são automaticamente deployados em um preview URL. Verifique o comentário do bot no PR.

## Code Review

- Mínimo 2 aprovações antes do merge
- Todos os checks devem passar
- CI/CD deve estar verde

## Reportar Issues

Ao reportar uma issue, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado**
4. **Screenshots/logs** se aplicável
5. **Ambiente** (OS, navegador, Node version)

## Comunidade

- Discord: [Link do Discord]
- Discussions: GitHub Discussions
- Email: contato@animequizzbrasil.com

## Código de Conduta

Seja respeitoso, inclusivo e construtivo. Assédio de qualquer tipo não será tolerado.

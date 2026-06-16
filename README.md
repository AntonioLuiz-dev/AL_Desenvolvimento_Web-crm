# AL CRM

CRM pessoal desenvolvido para gerenciar leads, clientes e o pipeline de vendas da **AL Desenvolvimento Web**. Permite acompanhar cada contato desde o primeiro lead até a conclusão do projeto, com integração direta ao WhatsApp.

---

## Funcionalidades

- **Dashboard** — visão geral com contagem de clientes, receita fechada, pipeline aberto e gráficos por status e nicho
- **Pipeline Kanban** — colunas Lead → Proposta → Em Andamento → Concluído → Arquivado
- **Gestão de clientes** — cadastro completo com nome, cidade, e-mail, múltiplos telefones, Instagram, nicho, valor e observações
- **Contato feito** — marque rapidamente se já entrou em contato com um lead, direto no card, sem abrir o modal
- **Integração WhatsApp** — gere mensagens de apresentação ou orçamento com pré-visualização e abra direto no WhatsApp Web
- **Busca e filtros** — pesquise por nome/cidade e filtre por status
- **Autenticação JWT** — acesso protegido por e-mail e senha com token de 30 dias
- **Layout responsivo** — funciona em desktop e mobile

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + Vite 5 |
| Backend (Serverless) | Node.js (Vercel Functions) |
| Banco de dados | MongoDB Atlas |
| Autenticação | JSON Web Token (jsonwebtoken) |
| Deploy | Vercel |

---

## Estrutura do projeto

```
al-crm/
├── api/
│   ├── _db.js          # Conexão com MongoDB (singleton)
│   ├── auth.js         # POST /api/auth — login e geração de token
│   └── clients.js      # CRUD /api/clients (GET, POST, PUT, DELETE)
├── src/
│   ├── App.jsx         # Toda a aplicação React (SPA)
│   ├── main.jsx        # Entry point
│   └── assets/         # Logo e imagens
├── vercel.json         # Rewrites: /api/* → functions, /* → index.html
├── vite.config.js      # Build config
└── package.json
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (local) ou configure no painel da Vercel:

| Variável | Descrição |
|----------|-----------|
| `MONGODB_URI` | String de conexão do MongoDB Atlas |
| `JWT_SECRET` | Segredo para assinar os tokens JWT (string aleatória longa) |
| `ADMIN_EMAIL` | E-mail de acesso ao CRM |
| `ADMIN_PASSWORD` | Senha de acesso ao CRM |

---

## Rodando localmente

**Pré-requisitos:** Node.js 18+ e uma instância do MongoDB Atlas (ou local).

```bash
# 1. Clone o repositório
git clone https://github.com/AntonioLuiz-dev/al-crm.git
cd al-crm

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com seus valores

# 4. Inicie o servidor de desenvolvimento (API + Vite em paralelo)
npm run dev
```

O frontend estará disponível em `http://localhost:5173` e a API em `http://localhost:3001`.

---

## Deploy na Vercel

1. Importe o repositório no [painel da Vercel](https://vercel.com/new)
2. Configure as quatro variáveis de ambiente (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`)
3. O build é detectado automaticamente via `vite build`
4. As rotas `/api/*` são servidas pelas Vercel Functions em `api/`

---

## API

Todos os endpoints (exceto `OPTIONS`) exigem o header:

```
Authorization: Bearer <token>
```

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth` | Login — retorna `{ token }` |
| `GET` | `/api/clients` | Lista todos os clientes |
| `POST` | `/api/clients` | Cria um novo cliente |
| `PUT` | `/api/clients` | Atualiza um cliente (requer `id` no body) |
| `DELETE` | `/api/clients?id=<id>` | Remove um cliente |

---

## Licença

Uso pessoal — AL Desenvolvimento Web.

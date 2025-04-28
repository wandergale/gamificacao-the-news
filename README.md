# 📚 The News - Gamificação

Projeto fullstack para gamificação da newsletter **The News**, incentivando o engajamento dos leitores através de sistema de streaks e estatísticas personalizadas.

## 🚀 Tecnologias

- **Frontend**: React.js (JavaScript)
- **Backend**: Node.js, TypeScript, Express
- **Banco de Dados**: PostgreSQL
- **Hospedagem**: Vercel (Frontend), Render (Backend)
- **Outros**: Webhooks da Beehiiv, JWT para autenticação

## 🎯 Funcionalidades

- Área logada para leitores:
  - Visualizar streaks de leitura.
  - Acompanhar estatísticas de engajamento.
- Dashboard administrativo:
  - Análise de métricas de leitura.
  - Visualização de dados de UTM.
- Integração via Webhook com a plataforma Beehiiv para atualização de leituras.

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js
- PostgreSQL
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/the-news-gamificacao.git
```
2. instale as dependências:
```bash
# No frontend
cd frontend
npm install

# No backend
cd ../backend
npm install
```
3. Configure as variáveis de ambiente:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/the_news
JWT_SECRET=sua_chave_secreta
BEEHIIV_WEBHOOK_SECRET=sua_chave_webhook
```
4. Rode as aplicações:
```bash
# No backend
cd backend
npm run dev
#-------------
# No frontend
cd frontend
npm start
```
## 🌐 Deploy
Frontend: Vercel - [Link do projeto](https://the-news-bice.vercel.app/) <br/>
Backend: Renden - Aqui fica a sua API
## 👨‍💻 Autor
**Wanderson Oliveira** <br/>
**[Linkedin](https://www.linkedin.com/in/wandergale/)**

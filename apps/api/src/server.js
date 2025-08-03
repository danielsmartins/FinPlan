import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mainRouter from './routes/main.router.js'; // Importa o roteador principal com o novo nome

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rota Raiz da API
// Todas as rotas definidas no mainRouter serão prefixadas com /api
// Ex: /api/auth/login, /api/transactions, /api/categories
app.use('/api', mainRouter);

// Iniciar o servidor
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
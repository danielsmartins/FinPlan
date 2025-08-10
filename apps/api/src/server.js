import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mainRouter from './routes/main.router.js'; 

dotenv.config();
const app = express();

// Middlewares globais
const allowedOrigins = [
  'https://fin-plan-web.vercel.app', // Sua aplicação em produção
  'http://localhost:5173'           // Sua aplicação em desenvolvimento
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: Postman, apps mobile) ou se a origem estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
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
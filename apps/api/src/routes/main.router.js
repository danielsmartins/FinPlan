import { Router } from 'express';
import authRouter from './auth.routes.js';
import transactionRouter from './transaction.routes.js';
import categoryRouter from './category.routes.js';

const mainRouter = Router();

// Agrupa todas as rotas sob seus prefixos designados
mainRouter.use('/auth', authRouter);
mainRouter.use('/transactions', transactionRouter);
mainRouter.use('/categories', categoryRouter);

export default mainRouter;
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import transactionRoutes from './transaction.routes.js';
import investmentRoutes from './investment.routes.js';
import budgetRoutes from './budget.routes.js';       
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.use('/auth', authRoutes);

// Middleware de autenticação: todas as rotas abaixo serão protegidas
router.use(authMiddleware);

// Rotas privadas 
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/investments', investmentRoutes); 
router.use('/budgets', budgetRoutes);       

export default router;

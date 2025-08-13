import { Router } from 'express';
import  prisma  from '../database/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const dashboardRouter = Router();

// Middleware para garantir que o utilizador está autenticado
dashboardRouter.use(authMiddleware);

// Rota única para buscar todos os dados do dashboard
dashboardRouter.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const [transactions, categories, investments, budgets, creditCards] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' } // garantir ordenação
      }),
      prisma.category.findMany({ where: { userId } }),
      prisma.investment.findMany({ where: { userId } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.creditCard.findMany({ where: { userId } })
    ]);

    res.json({
      transactions,
      categories,
      investments,
      budgets,
      creditCards
    });

  } catch (error) {
    console.error("Erro ao buscar dados completos do dashboard:", error);
    res.status(500).json({ error: 'Não foi possível buscar os dados do dashboard.' });
  }
});

export default dashboardRouter;

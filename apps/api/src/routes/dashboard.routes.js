import { Router } from 'express';
import { prisma } from '../database/prisma.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const dashboardRouter = Router();

// Middleware para garantir que o utilizador está autenticado
dashboardRouter.use(authMiddleware);

// Rota única para buscar todos os dados do dashboard
dashboardRouter.get('/', async (req, res) => {
  try {
    const userId = req.userId; // Obtido do authMiddleware

    // Usamos Promise.all para buscar todos os dados em paralelo, o que é mais rápido
    const [transactions, categories, investments, budgets, creditCards] = await Promise.all([
      prisma.transaction.findMany({ where: { userId } }),
      prisma.category.findMany({ where: { userId } }),
      prisma.investment.findMany({ where: { userId } }),
      prisma.budget.findMany({ where: { userId } }), // Simplificado, pode precisar de filtro de data no futuro
      prisma.creditCard.findMany({ where: { userId } })
    ]);

    // Devolvemos tudo num único objeto JSON
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

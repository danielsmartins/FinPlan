import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Rota para LER os orçamentos de um mês/ano específico
router.get('/', async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios.' });
  }

  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.id,
        month: parseInt(month),
        year: parseInt(year),
      },
      include: { category: true },
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os orçamentos.' });
  }
});

// Rota para CRIAR ou ATUALIZAR um orçamento (Upsert)
router.post('/', async (req, res) => {
  const { categoryId, amount, month, year } = req.body;
  
  // Validação mais robusta no backend
  if (!categoryId || !month || !year) {
    return res.status(400).json({ error: 'ID da categoria, mês e ano são obrigatórios.' });
  }

  // Trata o valor do amount: se for nulo ou indefinido, considera como 0.
  const finalAmount = (amount == null || isNaN(parseFloat(amount))) ? 0 : parseFloat(amount);

  try {
    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: req.user.id,
          categoryId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
      update: { amount: finalAmount },
      create: {
        userId: req.user.id,
        categoryId,
        amount: finalAmount,
        month: parseInt(month),
        year: parseInt(year),
      },
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível salvar o orçamento.' });
  }
});

export default router;

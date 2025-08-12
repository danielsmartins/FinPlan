import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Rota para LER os orçamentos 
router.get('/', async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.id;

  if (!month || !year) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios.' });
  }

  const monthInt = parseInt(month);
  const yearInt = parseInt(year);

  try {
   
    const budgets = await prisma.$queryRaw`
      WITH RankedBudgets AS (
        SELECT
          b.amount,
          b."categoryId",
          b.month,
          b.year,
          ROW_NUMBER() OVER(
            PARTITION BY b."categoryId" 
            ORDER BY b.year DESC, b.month DESC
          ) as rn
        FROM "Budget" AS b
        INNER JOIN "Category" AS c ON b."categoryId" = c.id
        WHERE 
          c."userId" = ${userId} AND
          (b.year < ${yearInt} OR (b.year = ${yearInt} AND b.month <= ${monthInt}))
      )
      SELECT
        rb.amount,
        rb."categoryId",
        rb.month,
        rb.year
      FROM RankedBudgets AS rb
      WHERE rb.rn = 1;
    `;
    
    res.json(budgets);

  } catch (error) {
    console.error("Erro detalhado ao buscar orçamentos:", error);
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

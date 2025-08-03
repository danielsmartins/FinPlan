import { Router } from 'express';
import prisma from '../database/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Ajuste o caminho se necessário

const transactionRouter = Router();

// Aplica o middleware de autenticação a todas as rotas de transação
transactionRouter.use(authMiddleware);

// CREATE: POST /api/transactions
transactionRouter.post('/', async (req, res) => {
  try {
    const { type, title, amount, date, categoryId } = req.body;
    if (!type || !title || amount === undefined || !date) {
      return res.status(400).json({ error: 'Campos type, title, amount e date são obrigatórios.' });
    }
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        type, title, amount,
        date: new Date(date),
        categoryId,
      }
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

// READ: GET /api/transactions
transactionRouter.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      include: { category: true },
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as transações.' });
  }
});

// UPDATE: PUT /api/transactions/:id
transactionRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, amount, date, categoryId } = req.body;
    const transaction = await prisma.transaction.findFirst({
      where: { id: id, userId: req.user.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada ou você não tem permissão.' });
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { type, title, amount, date: new Date(date), categoryId },
    });
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível atualizar a transação.' });
  }
});

// DELETE: DELETE /api/transactions/:id
transactionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findFirst({
      where: { id: id, userId: req.user.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada ou você não tem permissão.' });
    }
    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível deletar a transação.' });
  }
});

export default transactionRouter;
import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Função auxiliar para ajustar a data para o fuso horário correto
// Isso neutraliza a conversão automática que faz a data "voltar" um dia.
const adjustDateForTimezone = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000; // offset em milissegundos
  return new Date(date.getTime() + userTimezoneOffset);
};

// Rota para LER todas as transações do usuário
router.get('/', async (req, res) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId: req.user.id },
        include: {
            category: true, // Inclui dados da categoria relacionada
        },
        orderBy: {
          date: 'desc',
        },
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Não foi possível buscar as transações.' });
    }
});

// Rota para CRIAR uma nova transação
router.post('/', async (req, res) => {
  const { title, amount, date, type, categoryId, creditCardId, status } = req.body;

  if (!title || amount == null || !date || !type) {
    return res.status(400).json({ error: 'Título, valor, data e tipo são obrigatórios.' });
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        title,
        amount: parseFloat(amount),
        date: adjustDateForTimezone(date), // <<< CORREÇÃO APLICADA AQUI
        type,
        status,
        categoryId,
        creditCardId,
      },
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

// Rota para ATUALIZAR uma transação
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, amount, date, type, categoryId, creditCardId, status } = req.body;
  
    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { id: id, userId: req.user.id },
        data: {
            title,
            amount: amount != null ? parseFloat(amount) : undefined,
            date: date ? adjustDateForTimezone(date) : undefined, // <<< CORREÇÃO APLICADA AQUI
            type,
            status,
            categoryId,
            creditCardId,
        },
      });
      res.json(updatedTransaction);
    } catch (error) {
      res.status(404).json({ error: 'Transação não encontrada ou não pertence ao usuário.' });
    }
});

// Rota para DELETAR uma transação
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.transaction.delete({
        where: { id: id, userId: req.user.id },
      });
      res.status(204).send(); // Sem conteúdo
    } catch (error) {
      res.status(404).json({ error: 'Transação não encontrada ou não pertence ao usuário.' });
    }
});

export default router;

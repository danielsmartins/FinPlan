import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Rota para LER todos os cartões do usuário
router.get('/', async (req, res) => {
  try {
    const creditCards = await prisma.creditCard.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });
    res.json(creditCards);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os cartões de crédito.' });
  }
});

// Rota para CRIAR um novo cartão
router.post('/', async (req, res) => {
  const { name, closingDay, dueDay } = req.body;
  if (!name || !closingDay || !dueDay) {
    return res.status(400).json({ error: 'Nome, dia de fechamento e dia de vencimento são obrigatórios.' });
  }

  try {
    const newCard = await prisma.creditCard.create({
      data: {
        userId: req.user.id,
        name,
        closingDay: parseInt(closingDay),
        dueDay: parseInt(dueDay),
      },
    });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar o cartão.' });
  }
});

// Rota para ATUALIZAR um cartão de crédito
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, closingDay, dueDay } = req.body;

  try {
    const updatedCard = await prisma.creditCard.update({
      where: {
        id: id,
        userId: req.user.id, // Garante que o usuário só pode editar o seu próprio cartão
      },
      data: {
        name,
        closingDay: closingDay ? parseInt(closingDay) : undefined,
        dueDay: dueDay ? parseInt(dueDay) : undefined,
      },
    });
    res.json(updatedCard);
  } catch (error) {
    // Prisma lança um erro se o registro não for encontrado para a condição `where`
    res.status(404).json({ error: 'Cartão de crédito não encontrado ou não pertence ao usuário.' });
  }
});

// Rota para DELETAR um cartão de crédito
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.creditCard.delete({
      where: {
        id: id,
        userId: req.user.id, // Garante que o usuário só pode deletar o seu próprio cartão
      },
    });
    res.status(204).send(); // Sucesso, sem conteúdo
  } catch (error) {
    res.status(404).json({ error: 'Cartão de crédito não encontrado ou não pertence ao usuário.' });
  }
});

export default router;

import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();


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


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, closingDay, dueDay } = req.body;

  try {
    const updatedCard = await prisma.creditCard.update({
      where: {
        id: id,
        userId: req.user.id, 
      },
      data: {
        name,
        closingDay: closingDay ? parseInt(closingDay) : undefined,
        dueDay: dueDay ? parseInt(dueDay) : undefined,
      },
    });
    res.json(updatedCard);
  } catch (error) {
    
    res.status(404).json({ error: 'Cartão de crédito não encontrado ou não pertence ao usuário.' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.creditCard.delete({
      where: {
        id: id,
        userId: req.user.id, 
      },
    });
    res.status(204).send(); 
  } catch (error) {
    res.status(404).json({ error: 'Cartão de crédito não encontrado ou não pertence ao usuário.' });
  }
});

export default router;

import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Rota para LER todos os investimentos do usuário
router.get('/', async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { userId: req.user.id },
      orderBy: { description: 'asc' },
    });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os investimentos.' });
  }
});

// Rota para CRIAR um novo investimento
router.post('/', async (req, res) => {
  const { description, value } = req.body;
  if (!description || value == null) {
    return res.status(400).json({ error: 'Descrição e valor são obrigatórios.' });
  }

  try {
    const newInvestment = await prisma.investment.create({
      data: {
        userId: req.user.id,
        description,
        value: parseFloat(value),
      },
    });
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar o investimento.' });
  }
});

// Rota para ATUALIZAR um investimento
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { description, value } = req.body;
  
    try {
      const updatedInvestment = await prisma.investment.update({
        where: { id: id, userId: req.user.id }, // Garante que o usuário só pode editar o seu
        data: {
          description,
          value: parseFloat(value),
        },
      });
      res.json(updatedInvestment);
    } catch (error) {
      res.status(404).json({ error: 'Investimento não encontrado ou não pertence ao usuário.' });
    }
  });

// Rota para DELETAR um investimento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.investment.delete({
      where: { id: id, userId: req.user.id },
    });
    res.status(204).send(); // Sem conteúdo
  } catch (error) {
    res.status(404).json({ error: 'Investimento não encontrado ou não pertence ao usuário.' });
  }
});

export default router;

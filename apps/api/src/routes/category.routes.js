import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

// Rota para LER todas as categorias
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as categorias.' });
  }
});

// Rota para CRIAR uma nova categoria (agora com ícone)
router.post('/', async (req, res) => {
  const { name, icon } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        userId: req.user.id,
        name,
        icon, // Salva o novo ícone (emoji)
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a categoria.' });
  }
});

// Rota para ATUALIZAR uma categoria (para mudar nome ou ícone)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body;

    try {
        const updatedCategory = await prisma.category.update({
            where: { id: id, userId: req.user.id },
            data: { name, icon },
        });
        res.json(updatedCategory);
    } catch (error) {
        res.status(404).json({ error: 'Categoria não encontrada.' });
    }
});


// Rota para DELETAR uma categoria
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: id, userId: req.user.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Categoria não encontrada.' });
  }
});

export default router;

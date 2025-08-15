import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();


router.get('/', async (req, res) => {
  console.log("Usuário autenticado:", req.user);
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
        icon,
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a categoria.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;

  try {
    const updatedCategory = await prisma.category.updateMany({
      where: { id, userId: req.user.id },
      data: { name, icon },
    });

    if (updatedCategory.count === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.json({ message: 'Categoria atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await prisma.category.deleteMany({
      where: { id, userId: req.user.id },
    });

    if (deletedCategory.count === 0) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar categoria.' });
  }
});

export default router;

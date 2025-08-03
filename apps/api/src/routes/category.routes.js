import { Router } from 'express';
import prisma from '../database/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Ajuste o caminho se necessário

const categoryRouter = Router();

// Aplica o middleware de autenticação a todas as rotas de categoria
categoryRouter.use(authMiddleware);

// CREATE: POST /api/categories
categoryRouter.post('/', async (req, res) => {
  const { name, icon } = req.body;
  const userId = req.user.id;
  if (!name) {
    return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  }
  try {
    const newCategory = await prisma.category.create({
      data: { name, icon, userId },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno ao criar categoria.' });
  }
});

// READ: GET /api/categories
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno ao listar categorias.' });
  }
});

// UPDATE: PUT /api/categories/:id
categoryRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;

        const category = await prisma.category.findFirst({
            where: { id: id, userId: req.user.id }
        });

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada ou você não tem permissão.' });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, icon }
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao atualizar a categoria.' });
    }
});

// DELETE: DELETE /api/categories/:id
categoryRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findFirst({
            where: { id: id, userId: req.user.id }
        });

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada ou você não tem permissão.' });
        }

        // O schema vai cuidar para que as transações associadas fiquem com categoryId = null
        await prisma.category.delete({
            where: { id }
        });
        
        res.status(204).send();
    } catch (error) {
        // Se a categoria ainda estiver em uso e a regra do DB impedir, pode dar erro.
        res.status(500).json({ message: 'Erro interno ao deletar a categoria.' });
    }
});

export default categoryRouter;
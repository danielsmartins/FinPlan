// Em api/src/routes/investment.routes.js

import { Router } from 'express';
import prisma from '../database/prisma.js';
import { z } from 'zod'; // Usando Zod para validações seguras

const router = Router();

// Schema de validação para garantir que os dados estão corretos
const investmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  ticker: z.string().min(1, "O ticker é obrigatório."),
  type: z.enum(['RENDA_FIXA', 'ACAO_BR', 'ACAO_EUA', 'FII', 'BDR', 'ETF', 'CRIPTOMOEDA', 'OUTRO']),
  quantity: z.number().positive("A quantidade deve ser um número positivo."),
  averageCost: z.number().min(0, "O preço médio não pode ser negativo."),
  currentPrice: z.number().min(0, "A cotação atual não pode ser negativa."),
});

// Rota GET: Listar todos os investimentos do usuário
router.get('/', async (req, res) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' }
    });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ error: "Não foi possível buscar os investimentos." });
  }
});

// Rota POST: Criar um novo ativo de investimento
router.post('/', async (req, res) => {
  try {
    const data = investmentSchema.parse(req.body);
    const newInvestment = await prisma.investment.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });
    res.status(201).json(newInvestment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Não foi possível criar o investimento." });
  }
});

// Rota PUT: Atualizar um investimento existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = investmentSchema.parse(req.body);

    // Garante que o usuário só pode atualizar o próprio investimento
    const investment = await prisma.investment.findFirst({
        where: { id: id, userId: req.user.id }
    });

    if (!investment) {
        return res.status(404).json({ error: "Investimento não encontrado." });
    }

    const updatedInvestment = await prisma.investment.update({
      where: { id: id },
      data,
    });
    res.json(updatedInvestment);
  } catch (error) {
     if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Não foi possível atualizar o investimento." });
  }
});


// Rota DELETE: Apagar um ativo de investimento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Garante que o usuário só pode apagar o próprio investimento
        const investment = await prisma.investment.findFirst({
            where: { id: id, userId: req.user.id }
        });

        if (!investment) {
            return res.status(404).json({ error: "Investimento não encontrado." });
        }

        await prisma.investment.delete({
            where: { id: id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Não foi possível apagar o investimento." });
    }
});

export default router;
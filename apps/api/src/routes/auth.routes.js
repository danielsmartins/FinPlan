import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';

const authRouter = Router();

// Rota: POST /api/auth/check-email
authRouter.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório.' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(200).json({ isAvailable: false });
    }
    return res.status(200).json({ isAvailable: true });
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    res.status(500).json({ error: 'Ocorreu um erro interno ao verificar o email.' });
  }
});


// Rota: POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Dados inválidos. Verifique nome, e-mail e a senha (mínimo 6 caracteres).' });
    }

    // Lista de categorias padrão para novos usuários
    const defaultCategories = [
      { name: 'Aluguel', icon: '🏠' },
      { name: 'Alimentação', icon: '🍔' },
      { name: 'Compras', icon: '🛍️' },
      { name: 'Lazer', icon: '🎬' },
      { name: 'Academia', icon: '💪' },
      { name: 'Celular', icon: '📱' },
      { name: 'Transporte', icon: '🚗' },
    ];

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await prisma.$transaction(async (tx) => {

      const user = await tx.user.create({
        data: { name, email, password: hashedPassword },
      });

    
      const categoriesData = defaultCategories.map(cat => ({
        ...cat,
        userId: user.id,
      }));

      await tx.category.createMany({
        data: categoriesData,
      });

      return user;
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }
    console.error("Erro no registro:", error);
    res.status(500).json({ error: 'Não foi possível criar o usuário.' });
  }
});

// Rota: POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro interno.' });
  }
});

export default authRouter;

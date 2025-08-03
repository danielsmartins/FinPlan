import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/prisma.js';

const authRouter = Router();

// Rota: POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ error: 'Dados inválidos. Verifique nome, e-mail e a senha (mínimo 6 caracteres).' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o usuário. O e-mail pode já estar em uso.' });
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
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha inválida.' });
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
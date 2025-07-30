import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from './middlewares/auth.js';


const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();


// rotas públicas 
app.post('/register', async (req, res) => {
  try {
    
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // d. Usa o Prisma Client para criar um novo usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // e. Envia uma resposta de sucesso
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    // Se o prisma.user.create falhar ele vai gerar um erro
    res.status(400).json({ error: 'Não foi possível criar o usuário. O e-mail pode já estar em uso.' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

   
    const user = await prisma.user.findUnique({
      where: { email },
    });

   
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha enviada com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    // Gera um Token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    // Envia o token para o cliente
    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro interno.' });
  }
});


// rotas privadas

app.post('/transactions', authMiddleware, async (req, res) => {
  try {
    // Graças ao middleware, temos o ID do usuário logado em `req.userId`
    const userId = req.userId;
    const { type, title, amount, date } = req.body;

    // Validação simples dos dados da transação
    if (!type || !title || amount === undefined || !date) {
        return res.status(400).json({ error: 'Todos os campos (type, title, amount, date) são obrigatórios.' });
    }

    const transaction = await prisma.transaction.create({
        data: {
            userId, 
            type,
            title,
            amount,
            date: new Date(date), 
        }
    });

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
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

// CREATE - Criar uma nova transação
app.post('/transactions', authMiddleware, async (req, res) => {
  try {
    
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

// READ - Buscar todas as transações do usuário autenticado
app.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc', // Ordena pela data, da mais nova para a mais antiga
      },
    });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as transações.' });
  }
});

// UPDATE - Atualizar uma transação existente
app.put('/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da transação pela URL
    const userId = req.userId; // Pega o ID do usuário pelo token
    const { type, title, amount, date } = req.body; // Pega os novos dados

    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    if (transaction.userId !== userId) {
      
      return res.status(403).json({ error: 'Acesso negado.' });
    }

   
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        title,
        amount,
        date: new Date(date),
      },
    });

    res.status(200).json(updatedTransaction);

  } catch (error) {
    res.status(500).json({ error: 'Não foi possível atualizar a transação.' });
  }
});


// DELETE - Deletar uma transação
app.delete('/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    
    await prisma.transaction.delete({
      where: { id },
    });

    
    res.status(204).send(); 

  } catch (error) {
    res.status(500).json({ error: 'Não foi possível deletar a transação.' });
  }
});
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
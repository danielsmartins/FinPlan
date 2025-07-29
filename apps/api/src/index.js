// apps/api/src/index.js

// 1. IMPORTAR AS FERRAMENTAS
import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client'
const { PrismaClient } = pkg    // O Cliente que acabamos de gerar!
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 2. INICIAR AS FERRAMENTAS
const app = express();
app.use(cors());
app.use(express.json()); 

const prisma = new PrismaClient(); // Nosso tradutor pronto para trabalhar!

// 3. DEFINIR A ROTA DE REGISTRO
app.post('/register', async (req, res) => {
  try {
    // a. Pega os dados do corpo da requisição
    const { name, email, password } = req.body;

    // b. Criptografa a senha (NUNCA SALVE SENHAS EM TEXTO PURO)
    const hashedPassword = await bcrypt.hash(password, 10);

    // c. Usa o Prisma Client para criar um novo usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // d. Envia uma resposta de sucesso
    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    // Se o prisma.user.create falhar (ex: email duplicado), ele vai gerar um erro
    res.status(400).json({ error: 'Não foi possível criar o usuário. O e-mail pode já estar em uso.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // a. Busca o usuário no banco de dados pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // b. Se o usuário não existe, retorna um erro
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // c. Compara a senha enviada com a senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    // d. Se tudo estiver certo, gera um "crachá de autorização" (Token JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Informações que vão dentro do crachá
      process.env.JWT_SECRET, // A chave secreta para assinar o crachá
      { expiresIn: '30d' } // Validade do crachá (1 dia)
    );

    // e. Envia o crachá (token) para o cliente
    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro interno.' });
  }
});

// 4. INICIAR O SERVIDOR
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
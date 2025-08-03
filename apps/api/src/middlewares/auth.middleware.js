import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Usa a versão síncrona do verify dentro de um try/catch
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // AQUI A MUDANÇA PRINCIPAL:
    // Anexamos um objeto 'user' com o 'id' dentro dele.
    // Isso torna o middleware mais extensível para o futuro.
    req.user = { id: decoded.userId };
    
    next(); // Se tudo deu certo, passa para o controller.
  } catch (error) {
    // Se jwt.verify falhar (token inválido, expirado), ele lança um erro.
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

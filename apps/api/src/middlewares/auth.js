
import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
 
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  // 
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  //  Verifica se o "scheme" é "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // 6. Se o token for válido, anexa o ID do usuário na requisição
    req.userId = decoded.userId;

    
    return next();
  });
}

export default authMiddleware;
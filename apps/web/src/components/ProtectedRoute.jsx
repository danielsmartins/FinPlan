import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Verificamos se o token existe no localStorage
  const token = localStorage.getItem('authToken');

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se houver um token, renderiza o componente filho
  return children;
}

export default ProtectedRoute;
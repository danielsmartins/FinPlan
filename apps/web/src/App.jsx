import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importando as páginas e componentes de layout
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BudgetPage from './components/BudgetPage'; // Nova página
import MainLayout from './components/MainLayout'; // Novo layout com Navbar
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // O <Router> foi removido daqui, pois ele deve envolver o <App /> no seu arquivo main.jsx
    <Routes>
      {/* --- Rotas Públicas --- */}
      {/* A sua página Home continua sendo a rota principal */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- Grupo de Rotas Protegidas --- */}
      {/* Todas as rotas aqui dentro serão protegidas e usarão o MainLayout com a Navbar */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* As páginas filhas serão renderizadas dentro do <Outlet /> do MainLayout */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<BudgetPage />} />
        {/* Adicione futuras páginas protegidas aqui */}
      </Route>
    </Routes>
  );
}

export default App;

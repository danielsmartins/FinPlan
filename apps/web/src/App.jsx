import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importando as páginas e componentes de layout
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BudgetPage from './components/BudgetPage';
import LancamentosPage from './components/LancamentosPage'; // Nova página
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // O <Router> é removido daqui e fica no main.jsx
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- Grupo de Rotas Protegidas --- */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/lancamentos" element={<LancamentosPage />} /> {/* ROTA ADICIONADA */}
      </Route>
    </Routes>
  );
}

export default App;

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PowerIcon } from '@heroicons/react/24/solid';
import ConfirmModal from './ConfirmModal';

function Navbar() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-500 hover:bg-opacity-75'
    }`;

  return (
    <>
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white font-bold text-xl">FinPlan</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={navLinkClasses}>
                    Visão Mensal
                  </NavLink>
                  <NavLink to="/budget" className={navLinkClasses}>
                    Orçamento
                  </NavLink>
                  <NavLink to="/lancamentos" className={navLinkClasses}> {/* LINK ADICIONADO */}
                    Lançamentos
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="bg-red-600 py-2 px-4 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                  title="Sair"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirmar Saída"
        message="Você tem certeza que deseja sair da sua conta?"
      />
    </>
  );
}

export default Navbar;

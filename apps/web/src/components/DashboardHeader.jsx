import React from 'react';

function DashboardHeader({ onNewTransaction }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Meu Dashboard</h1>
      <div className="flex items-center gap-4">
        {/* O botão de Gerenciar Categorias foi removido daqui */}
        <button
          onClick={onNewTransaction}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
        >
          Novo Lançamento
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
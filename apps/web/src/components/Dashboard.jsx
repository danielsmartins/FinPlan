import React from 'react';

function Dashboard() {
  const handleLogout = () => {
    // Lógica de logout virá aqui
    alert('Logout em breve!');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Meu Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </div>
      <p className="mt-4 text-gray-600">Bem-vindo à sua central financeira!</p>
      {/* O conteúdo do dashboard virá aqui */}
    </div>
  );
}

export default Dashboard;

function DashboardHeader({ onNewTransaction, onLogout, onManageCategories }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold text-slate-800">Meu Dashboard</h1>
      <div className="flex-shrink-0">
        {/* NOVO BOTÃO */}
        <button
          onClick={onManageCategories}
          className="px-5 py-2.5 mr-4 font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Gerenciar Categorias
        </button>
        <button
          onClick={onNewTransaction}
          className="px-5 py-2.5 mr-4 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Nova Transação
        </button>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
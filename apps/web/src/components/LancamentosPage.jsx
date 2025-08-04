import  { useState } from 'react';
import { useLancamentos } from '../hooks/useLancamentos'; 
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import AddTransactionForm from './AddTransactionForm';
import TransactionRow from './TransactionRow'; 
import clsx from 'clsx';

function LancamentosPage() {
  const {
    categories,
    isLoading,
    selectedDate,
    monthlyData,
    changeMonth,
    handleStatusChange,
    handleDelete,
    fetchData,
  } = useLancamentos();

  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    fetchData();
  };

  const tabClasses = (tabName) => clsx('px-4 py-2 font-semibold rounded-md transition-colors text-sm sm:text-base', { 'bg-blue-600 text-white shadow-sm': activeTab === tabName, 'text-gray-600 hover:bg-gray-100': activeTab !== tabName });
  
  const renderList = (list) => {
    if (list.length === 0) {
      return <p className="text-center text-gray-500 py-10">Nenhum lançamento encontrado.</p>;
    }
    return list.map(t => <TransactionRow key={t.id} transaction={t} onStatusChange={handleStatusChange} onEdit={handleEdit} onDelete={handleDelete} />);
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Lançamentos</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
              <span className="font-semibold text-lg w-32 text-center">{selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
            <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">Novo Lançamento</button>
          </div>
          
          <div className="mt-6 border-b"><div className="flex flex-wrap space-x-2 sm:space-x-4">
              <button onClick={() => setActiveTab('all')} className={tabClasses('all')}>Todos ({monthlyData.all.length})</button>
              <button onClick={() => setActiveTab('past')} className={tabClasses('past')}>Realizados ({monthlyData.past.length})</button>
              <button onClick={() => setActiveTab('pending')} className={tabClasses('pending')}>Pendentes ({monthlyData.pending.length})</button>
              <button onClick={() => setActiveTab('recurring')} className={tabClasses('recurring')}>Recorrentes ({monthlyData.recurring.length})</button>
          </div></div>

          {isLoading ? <p className="text-center py-10 text-gray-500">A carregar...</p> : (
            <div className="mt-4">
              {activeTab === 'all' && renderList(monthlyData.all)}
              {activeTab === 'past' && renderList(monthlyData.past)}
              {activeTab === 'pending' && renderList(monthlyData.pending)}
              {activeTab === 'recurring' && renderList(monthlyData.recurring)}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddTransactionForm onCancel={() => { setIsModalOpen(false); setEditingTransaction(null); }} onSuccess={handleSuccess} categories={categories} transactionToEdit={editingTransaction} />
      )}
    </>
  );
}

export default LancamentosPage;

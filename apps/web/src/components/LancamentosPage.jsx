import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTransactions, updateTransaction, createTransaction } from '../services/transaction.service';
import { getCategories } from '../services/category.service';
import { ClockIcon, CheckCircleIcon, ArrowPathIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import AddTransactionForm from './AddTransactionForm';
import clsx from 'clsx';

// Componente para renderizar uma linha de transação
function TransactionRow({ transaction, onStatusChange, onEdit }) {
  const isExpense = transaction.type === 'EXPENSE';
  const isProjected = transaction.id.toString().includes('-proj-'); // Verifica se é uma transação projetada
  
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="grid grid-cols-5 gap-4 items-center p-3 border-b hover:bg-slate-50">
      <div className="col-span-2">
        <p className="font-medium text-gray-800">{transaction.title}</p>
        <p className="text-xs text-gray-500">{transaction.category?.name || 'Sem categoria'}</p>
      </div>
      <div className="text-right">
        <p className={clsx("font-semibold", isExpense ? 'text-red-600' : 'text-green-600')}>
          {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
      </div>
      <div className="col-span-2 text-right flex justify-end items-center gap-2">
        {transaction.isRecurring && (
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full" title="Lançamento Recorrente">
            <ArrowPathIcon className="w-4 h-4" />
          </span>
        )}
        {transaction.status === 'PENDING' ? (
          <button onClick={() => onStatusChange(transaction, 'PAID')} className="flex items-center justify-center gap-1 text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full hover:bg-yellow-200" title="Marcar como pago/recebido">
            <ClockIcon className="w-4 h-4" /> Pendente
          </button>
        ) : (
           <span className="flex items-center gap-1 text-xs font-semibold text-green-800 bg-green-100 px-2 py-1 rounded-full" title="Lançamento Realizado">
            <CheckCircleIcon className="w-4 h-4" /> Realizado
          </span>
        )}
        <button 
          onClick={() => onEdit(transaction)} 
          className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed" 
          title="Editar Lançamento"
          disabled={isProjected} // Desativa o botão para transações projetadas
        >
            <PencilIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LancamentosPage() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transactionsData, categoriesData] = await Promise.all([ getTransactions(), getCategories() ]);
      setAllTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthlyData = useMemo(() => {
    const targetMonth = selectedDate.getMonth();
    const targetYear = selectedDate.getFullYear();

    const realTransactionsInMonth = allTransactions.filter(t => {
        const date = new Date(t.date);
        return date.getUTCMonth() === targetMonth && date.getUTCFullYear() === targetYear;
    });

    const recurringTemplates = allTransactions.filter(t => t.isRecurring);
    const projectedTransactions = [];

    recurringTemplates.forEach(template => {
        const templateDate = new Date(template.date);
        const templateDay = templateDate.getUTCDate();
        
        // Verifica se o template deve ocorrer no mês/ano selecionado
        const startYear = templateDate.getUTCFullYear();
        const startMonth = templateDate.getUTCMonth();

        if (targetYear > startYear || (targetYear === startYear && targetMonth >= startMonth)) {
            if (template.recurrenceType === 'MONTHLY') {
                const occurrenceDate = new Date(Date.UTC(targetYear, targetMonth, templateDay, 12, 0, 0));
                
                // Garante que a data não "saltou" um mês (ex: dia 31 num mês de 30 dias)
                if (occurrenceDate.getUTCMonth() === targetMonth) {
                    const alreadyExists = realTransactionsInMonth.some(t => {
                        const realDate = new Date(t.date);
                        return t.title === template.title && realDate.getUTCDate() === occurrenceDate.getUTCDate();
                    });

                    if (!alreadyExists) {
                        projectedTransactions.push({
                            ...template,
                            id: `${template.id}-proj-${targetMonth}-${targetYear}`,
                            date: occurrenceDate.toISOString(),
                            status: 'PENDING',
                            isRecurring: false,
                        });
                    }
                }
            }
        }
    });

    const combined = [...realTransactionsInMonth, ...projectedTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const past = combined.filter(t => t.status === 'PAID');
    const pending = combined.filter(t => t.status === 'PENDING');
    const recurring = allTransactions.filter(t => t.isRecurring).sort((a, b) => new Date(b.date) - new Date(a.date));

    return { all: combined, past, pending, recurring };
  }, [allTransactions, selectedDate]);

  const handleStatusChange = async (transaction, newStatus) => {
    const isProjected = transaction.id.toString().includes('-proj-');

    try {
      if (isProjected) {
        const newTransactionData = { ...transaction, status: newStatus, isRecurring: false };
        delete newTransactionData.id;
        await createTransaction(newTransactionData);
      } else {
        await updateTransaction(transaction.id, { status: newStatus });
      }
      fetchData();
    } catch (error) {
      alert('Erro ao atualizar status da transação.');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    fetchData();
  };
  
  const changeMonth = (amount) => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const tabClasses = (tabName) => clsx('px-4 py-2 font-semibold rounded-md transition-colors text-sm sm:text-base', { 'bg-blue-600 text-white shadow-sm': activeTab === tabName, 'text-gray-600 hover:bg-gray-100': activeTab !== tabName });
  const renderList = (list) => list.length === 0 ? <p className="text-center text-gray-500 py-10">Nenhum lançamento encontrado.</p> : list.map(t => <TransactionRow key={t.id} transaction={t} onStatusChange={handleStatusChange} onEdit={handleEdit} />);

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

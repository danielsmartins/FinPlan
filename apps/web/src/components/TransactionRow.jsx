import React, { useState } from 'react';
import { ClockIcon, CheckCircleIcon, ArrowPathIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import TransactionActions from './TransactionActions';
import clsx from 'clsx';

function TransactionRow({ transaction, onStatusChange, onEdit, onDelete }) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const isExpense = transaction.type === 'EXPENSE';
  const isProjected = transaction.id.toString().includes('-proj-');
  
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleEdit = (transaction) => {
    onEdit(transaction);
    setIsActionsOpen(false);
  };

  const handleDelete = (id) => {
    onDelete(id);
    setIsActionsOpen(false);
  };

  return (
    <div className="flex items-center p-3 border-b hover:bg-slate-50">
      <div className="w-8 h-8 mr-4 text-2xl flex-shrink-0 flex items-center justify-center">
        {transaction.category?.icon || (isExpense ? '💸' : '💰')}
      </div>
      <div className="flex-grow overflow-hidden">
        <p className="font-medium text-gray-800 truncate">{transaction.title}</p>
        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <p className={clsx("font-semibold text-right", isExpense ? 'text-red-600' : 'text-green-600')}>
          {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
        </p>
        <div className="flex items-center gap-2">
            {transaction.status === 'PENDING' ? (
              <button onClick={() => onStatusChange(transaction, 'PAID')} className="flex items-center justify-center gap-1 text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full hover:bg-yellow-200" title="Marcar como pago/recebido">
                <ClockIcon className="w-4 h-4" />
              </button>
            ) : (
               <span className="flex items-center gap-1 text-xs font-semibold text-green-800 bg-green-100 px-2 py-1 rounded-full" title="Lançamento Realizado">
                <CheckCircleIcon className="w-4 h-4" />
              </span>
            )}
            <div className="relative">
                <button 
                    onClick={() => setIsActionsOpen(!isActionsOpen)} 
                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 disabled:text-gray-200 disabled:cursor-not-allowed" 
                    disabled={isProjected}
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                {isActionsOpen && (
                    <TransactionActions 
                        transaction={transaction} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionRow;

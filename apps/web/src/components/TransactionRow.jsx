import React, { useState } from 'react';
import { ClockIcon, CheckCircleIcon, ArrowPathIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import TransactionActions from './TransactionActions';
import clsx from 'clsx';

function TransactionRow({ transaction, onStatusChange, onEdit, onDelete }) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const isExpense = transaction.type === 'EXPENSE';
  const isProjected = transaction.id.toString().includes('-proj-');
  
  const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
        <div className="relative">
            <button 
                onClick={() => setIsActionsOpen(!isActionsOpen)} 
                className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-200 disabled:cursor-not-allowed" 
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
  );
}

export default TransactionRow;

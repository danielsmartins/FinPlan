import { useState } from 'react';
import TransactionActions from './TransactionActions';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

function TransactionList({ transactions, onEdit, onDelete }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleEdit = (transaction) => {
    onEdit(transaction);
    setOpenMenuId(null);
  };

  const handleDelete = (id) => {
    onDelete(id);
    setOpenMenuId(null);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Últimas Transações</h2>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.slice(0, 10).map((t) => (
            <li key={t.id} className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100">
              {t.type === 'INCOME' 
                ? <ArrowUpCircleIcon className="w-8 h-8 mr-3 text-green-500 flex-shrink-0" /> 
                : <ArrowDownCircleIcon className="w-8 h-8 mr-3 text-red-500 flex-shrink-0" />
              }
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-slate-800 truncate">{t.title}</p>
                <p className="text-sm text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <p className={`font-semibold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)} className="p-2 rounded-full text-slate-500 hover:bg-slate-200">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                  {openMenuId === t.id && (
                    <TransactionActions
                      transaction={t}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 pt-10">
          <p>Nenhuma transação encontrada.</p>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
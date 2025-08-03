import React, { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '../services/transaction.service'; // ATUALIZADO
import clsx from 'clsx';

function AddTransactionForm({ onCancel, onSuccess, transactionToEdit, categories }) {
  const isEditMode = Boolean(transactionToEdit);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setTitle(transactionToEdit.title);
      setAmount(String(transactionToEdit.amount));
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setType(transactionToEdit.type);
      setCategoryId(transactionToEdit.categoryId || '');
    }
  }, [transactionToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !type) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (type === 'EXPENSE' && !categoryId) {
        setError('Para despesas, a categoria é obrigatória.');
        return;
    }

    setLoading(true);
    setError('');

    const transactionData = {
      title,
      amount: parseFloat(amount),
      date,
      type,
      categoryId: type === 'EXPENSE' ? categoryId : null,
    };

    try {
  
      if (isEditMode) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      onSuccess();
    } catch (err) {
      setError('Erro ao salvar transação.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-20">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? 'Editar Transação' : 'Nova Transação'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex-1">
              <input type="radio" value="EXPENSE" checked={type === 'EXPENSE'} onChange={(e) => setType(e.target.value)} className="sr-only peer"/>
              <div className="w-full p-3 text-center border rounded-md cursor-pointer peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600">Despesa</div>
            </label>
            <label className="flex-1">
              <input type="radio" value="INCOME" checked={type === 'INCOME'} onChange={(e) => setType(e.target.value)} className="sr-only peer"/>
              <div className="w-full p-3 text-center border rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600">Receita</div>
            </label>
          </div>
          
          <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          
          {type === 'EXPENSE' && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={loading} className={clsx("px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700", { "opacity-50 cursor-not-allowed": loading })}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionForm;

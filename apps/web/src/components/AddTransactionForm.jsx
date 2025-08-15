import  { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '../services/transaction.service';
import clsx from 'clsx';

function AddTransactionForm({ onCancel, onSuccess, transactionToEdit, categories }) {
  const isEditMode = Boolean(transactionToEdit);


  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('PAID'); 
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('MONTHLY'); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setTitle(transactionToEdit.title);
      setAmount(String(transactionToEdit.amount));
      const dateObj = new Date(transactionToEdit.date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
      setType(transactionToEdit.type);
      setCategoryId(transactionToEdit.categoryId || '');
      setStatus(transactionToEdit.status || 'PAID');
      setIsRecurring(transactionToEdit.isRecurring || false);
      setRecurrenceType(transactionToEdit.recurrenceType || 'MONTHLY');
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
      status,
      isRecurring,
      recurrenceType,
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
          {/* Seletores de Tipo e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <div className="flex gap-2 mt-1">
                <label className="flex-1"><input type="radio" value="EXPENSE" checked={type === 'EXPENSE'} onChange={(e) => setType(e.target.value)} className="sr-only peer"/><div className="w-full p-2 text-center text-sm border rounded-md cursor-pointer peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600">Despesa</div></label>
                <label className="flex-1"><input type="radio" value="INCOME" checked={type === 'INCOME'} onChange={(e) => setType(e.target.value)} className="sr-only peer"/><div className="w-full p-2 text-center text-sm border rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600">Receita</div></label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex gap-2 mt-1">
                <label className="flex-1"><input type="radio" value="PAID" checked={status === 'PAID'} onChange={(e) => setStatus(e.target.value)} className="sr-only peer"/><div className="w-full p-2 text-center text-sm border rounded-md cursor-pointer peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600">Pago</div></label>
                <label className="flex-1"><input type="radio" value="PENDING" checked={status === 'PENDING'} onChange={(e) => setStatus(e.target.value)} className="sr-only peer"/><div className="w-full p-2 text-center text-sm border rounded-md cursor-pointer peer-checked:bg-yellow-500 peer-checked:text-white peer-checked:border-yellow-500">Pendente</div></label>
              </div>
            </div>
          </div>
          
          {/* Outros campos do formulário */}
          <div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
          {type === 'EXPENSE' && (<div><label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label><select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"><option value="" disabled>Selecione</option>{categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>)}
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label><input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
            <div><label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label><input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
          </div>

          {/* Opções de Recorrência */}
          <div className="pt-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="text-sm font-medium text-gray-700">Repetir este lançamento</span>
            </label>
            {isRecurring && (
              <div className="mt-2 pl-7">
                <select value={recurrenceType} onChange={(e) => setRecurrenceType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <option value="MONTHLY">Mensalmente</option>
                  <option value="YEARLY">Anualmente</option>
                </select>
              </div>
            )}
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button><button type="submit" disabled={loading} className={clsx("px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700", { "opacity-50 cursor-not-allowed": loading })}>{loading ? 'Salvando...' : 'Salvar'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionForm;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/category.service';
import { getBudgets, upsertBudget } from '../services/budget.service';
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import EmojiPicker from 'emoji-picker-react'; // IMPORTADO

function BudgetPage() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [localBudgetValues, setLocalBudgetValues] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('😀'); // Emoji padrão
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Estado para controlar o seletor

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    try {
      const [categoriesData, budgetsData] = await Promise.all([
        getCategories(),
        getBudgets(month, year)
      ]);
      setCategories(categoriesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Erro ao buscar dados de orçamento:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName, icon: newCategoryIcon });
      setNewCategoryName('');
      setNewCategoryIcon('😀');
      fetchData();
    } catch (error) {
      alert('Erro ao criar categoria.');
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewCategoryIcon(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Tem a certeza? Apagar uma categoria também removerá orçamentos associados a ela.')) {
      try {
        await deleteCategory(id);
        fetchData();
      } catch (error) {
        alert('Erro ao apagar categoria.');
      }
    }
  };

  const handleBudgetChange = (categoryId, value) => {
    setLocalBudgetValues(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSaveBudget = async (categoryId) => {
    const originalBudget = mergedBudgetData.find(b => b.id === categoryId)?.budgetedAmount || 0;
    const currentValue = localBudgetValues[categoryId];
    const newAmount = currentValue === '' || currentValue == null ? 0 : parseFloat(currentValue);

    if (isNaN(newAmount)) {
      setLocalBudgetValues(prev => ({ ...prev, [categoryId]: originalBudget }));
      return;
    }
    if (newAmount === originalBudget) return;

    try {
      await upsertBudget({
        categoryId,
        amount: newAmount,
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
      });
      fetchData();
    } catch (error) {
      alert('Erro ao guardar orçamento.');
      setLocalBudgetValues(prev => ({ ...prev, [categoryId]: originalBudget }));
    }
  };
  
  const changeMonth = (amount) => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const mergedBudgetData = useMemo(() => {
    return categories.map(cat => {
      const budget = budgets.find(b => b.categoryId === cat.id);
      return {
        ...cat,
        budgetedAmount: budget ? budget.amount : 0,
      };
    });
  }, [categories, budgets]);

  useEffect(() => {
    const initialValues = {};
    mergedBudgetData.forEach(item => {
      initialValues[item.id] = item.budgetedAmount;
    });
    setLocalBudgetValues(initialValues);
  }, [mergedBudgetData]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Planeamento de Orçamento</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
            <span className="font-semibold text-lg w-32 text-center">
              {selectedDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
          </div>
        </div>

        {isLoading ? <p className="text-center py-10">A carregar...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 border-r pr-8">
              <h3 className="font-semibold text-lg mb-4">Categorias</h3>
              <div className="relative">
                <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-12 h-12 text-2xl flex items-center justify-center border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    {newCategoryIcon}
                  </button>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nova categoria"
                    className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Add</button>
                </form>
                {showEmojiPicker && (
                  <div className="absolute z-10">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon || '📁'}</span>
                      {cat.name}
                    </span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg mb-4">Planeamento Mensal</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-500">
                  <span>CATEGORIA</span>
                  <span className="text-right">ORÇADO</span>
                </div>
                {mergedBudgetData.map(item => (
                  <div key={item.id} className="grid grid-cols-2 gap-4 items-center">
                    <span className="font-medium flex items-center gap-3">
                      <span className="text-xl">{item.icon || '📁'}</span>
                      {item.name}
                    </span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={localBudgetValues[item.id] ?? ''}
                        onChange={(e) => handleBudgetChange(item.id, e.target.value)}
                        onBlur={() => handleSaveBudget(item.id)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                 <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="font-bold text-lg text-right">{formatCurrency(budgets.reduce((sum, b) => sum + b.amount, 0))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetPage;

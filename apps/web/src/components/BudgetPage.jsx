/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/category.service';
import { getBudgets, upsertBudget } from '../services/budget.service';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Importando os novos componentes
import CategoryPanel from './CategoryPanel';
import BudgetList from './BudgetList';

function BudgetPage() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [localBudgetValues, setLocalBudgetValues] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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

  const mergedBudgetData = useMemo(() => {
    return categories.map(cat => {
      const budget = budgets.find(b => b.categoryId === cat.id);
      return { ...cat, budgetedAmount: budget ? budget.amount : 0 };
    });
  }, [categories, budgets]);

  useEffect(() => {
    const initialValues = {};
    mergedBudgetData.forEach(item => {
      initialValues[item.id] = item.budgetedAmount;
    });
    setLocalBudgetValues(initialValues);
  }, [mergedBudgetData]);

  const handleAddCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      fetchData();
    } catch (error) {
      alert('Erro ao criar categoria.');
    }
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

    if (isNaN(newAmount) || newAmount === originalBudget) {
      if(isNaN(newAmount)) setLocalBudgetValues(prev => ({ ...prev, [categoryId]: originalBudget }));
      return;
    }

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

  const totalBudgeted = useMemo(() => budgets.reduce((sum, b) => sum + b.amount, 0), [budgets]);

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
            <CategoryPanel
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
            <BudgetList
              budgetsData={mergedBudgetData}
              localValues={localBudgetValues}
              onBudgetChange={handleBudgetChange}
              onSaveBudget={handleSaveBudget}
              totalBudgeted={totalBudgeted}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetPage;

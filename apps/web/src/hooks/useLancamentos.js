import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTransactions, updateTransaction, createTransaction, deleteTransaction } from '../services/transaction.service';
import { getCategories } from '../services/category.service';

export function useLancamentos() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transactionsData, categoriesData] = await Promise.all([getTransactions(), getCategories()]);
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
      const startYear = templateDate.getUTCFullYear();
      const startMonth = templateDate.getUTCMonth();

      if (targetYear > startYear || (targetYear === startYear && targetMonth >= startMonth)) {
        if (template.recurrenceType === 'MONTHLY') {
          const occurrenceDate = new Date(Date.UTC(targetYear, targetMonth, templateDay, 12, 0, 0));
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

  const handleDelete = async (transactionId) => {
    if (window.confirm('Tem a certeza que quer apagar este lançamento?')) {
      try {
        await deleteTransaction(transactionId);
        fetchData();
      } catch (error) {
        alert('Erro ao apagar o lançamento.');
      }
    }
  };
  
  const changeMonth = (amount) => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  return {
    categories,
    isLoading,
    selectedDate,
    monthlyData,
    changeMonth,
    handleStatusChange,
    handleDelete,
    fetchData,
  };
}

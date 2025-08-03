import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboard.service'; // ATUALIZADO
import { deleteTransaction } from '../services/transaction.service'; // ATUALIZADO

// Importando os componentes modulares
import CategoryManager from './CategoryManager'; 
import AddTransactionForm from './AddTransactionForm';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import ExpenseChart from './ExpenseChart';
import TransactionList from './TransactionList';

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // ATUALIZADO: A função agora usa o serviço do dashboard
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { transactions, categories } = await getDashboardData();
      setTransactions(transactions);
      setCategories(categories);
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const relevantTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = relevantTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = relevantTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'EXPENSE' && transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const dataGrouped = monthlyExpenses.reduce((acc, transaction) => {
      const category = transaction.category?.name || 'Sem Categoria';
      if (!acc[category]) { acc[category] = 0; }
      acc[category] += transaction.amount;
      return acc;
    }, {});

    return Object.entries(dataGrouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        // ATUALIZADO: Usa o serviço de transação para deletar
        await deleteTransaction(id);
        setTransactions(current => current.filter(t => t.id !== id));
      } catch (err) {
        console.error("Erro ao deletar transação:", err);
        alert("Não foi possível deletar a transação.");
      }
    }
  };

  const handleCategoriesUpdated = () => { 
    setIsCategoryModalOpen(false);
    fetchDashboardData(); 
  }

  const handleTransactionSaved = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    fetchDashboardData();
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando dados...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <DashboardHeader
          onNewTransaction={() => setIsAddModalOpen(true)}
          onLogout={handleLogout}
          onManageCategories={() => setIsCategoryModalOpen(true)}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Receitas do Mês" amount={monthlyStats.totalIncome} colorClass="text-green-600" />
              <StatCard title="Despesas do Mês" amount={monthlyStats.totalExpense} colorClass="text-red-600" />
              <StatCard title="Saldo do Mês" amount={monthlyStats.balance} colorClass={monthlyStats.balance >= 0 ? 'text-slate-800' : 'text-red-600'} />
            </div>
            <ExpenseChart data={expenseByCategory} totalExpenses={monthlyStats.totalExpense} />
          </div>
          <div className="lg:col-span-1">
            <TransactionList
              transactions={transactions}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {(isAddModalOpen || editingTransaction) && (
        <AddTransactionForm
          onCancel={handleCloseForm}
          onSuccess={handleTransactionSaved}
          transactionToEdit={editingTransaction}
          categories={categories}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryManager
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleCategoriesUpdated}
        />
      )}
    </div>
  );
}

export default Dashboard;

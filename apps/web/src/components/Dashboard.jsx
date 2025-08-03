import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboard.service';
import { deleteTransaction } from '../services/transaction.service';

// Importando os componentes modulares
import CategoryManager from './CategoryManager';
import AddTransactionForm from './AddTransactionForm';
import DashboardHeader from './DashboardHeader';
import BudgetAnalysis from './BudgetAnalysis';
import CreditCardBills from './CreditCardBills';


// Componente para os cards de estatísticas (sem alterações)
function StatCardV2({ title, mainValue, sub1Title, sub1Value, sub2Title, sub2Value, mainColor = 'text-gray-900' }) {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-gray-500 text-sm">{title}</h3>
        <p className={`text-2xl font-bold mt-2 ${mainColor}`}>{formatCurrency(mainValue)}</p>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{sub1Title}</span>
          <span className="font-medium text-gray-800">{formatCurrency(sub1Value)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{sub2Title}</span>
          <span className="font-medium text-gray-800">{formatCurrency(sub2Value)}</span>
        </div>
      </div>
    </div>
  );
}


function Dashboard() {
  const navigate = useNavigate();
  // Estados para os dados (sem alterações)
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Lógica de busca e cálculos (sem alterações por enquanto)
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { transactions, categories, investments, budgets } = await getDashboardData();
      setTransactions(transactions);
      setCategories(categories);
      setInvestments(investments);
      setBudgets(budgets);
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

  const dashboardMetrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const paidTransactions = transactions.filter(t => t.status === 'PAID');
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING');

    const totalInvested = investments.reduce((sum, inv) => sum + inv.value, 0);
    const totalIncomeAllTime = paidTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenseAllTime = paidTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const accountBalance = totalIncomeAllTime - totalExpenseAllTime;
    const totalPatrimony = totalInvested + accountBalance;

    const paidMonthlyIncome = paidTransactions.filter(t => t.type === 'INCOME' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const pendingMonthlyIncome = pendingTransactions.filter(t => t.type === 'INCOME' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);

    const paidMonthlyExpense = paidTransactions.filter(t => t.type === 'EXPENSE' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const pendingMonthlyExpense = pendingTransactions.filter(t => t.type === 'EXPENSE' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    return {
      totalPatrimony,
      totalInvested,
      accountBalance,
      paidMonthlyIncome,
      pendingMonthlyIncome,
      paidMonthlyExpense,
      pendingMonthlyExpense,
      totalMonthlyBudget,
    };
  }, [transactions, investments, budgets]);

  // Handlers (sem alterações)
  const handleSuccess = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
    setIsCategoryModalOpen(false);
    fetchDashboardData();
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setEditingTransaction(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-slate-100"><p className="text-gray-500">Carregando dados...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-slate-100"><p className="p-8 text-center text-red-600">{error}</p></div>;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <DashboardHeader
          onNewTransaction={() => setIsAddModalOpen(true)}
          onLogout={handleLogout}
          onManageCategories={() => setIsCategoryModalOpen(true)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatCardV2
            title="Patrimônio Total"
            mainValue={dashboardMetrics.totalPatrimony}
            sub1Title="Investido"
            sub1Value={dashboardMetrics.totalInvested}
            sub2Title="Saldo em Conta"
            sub2Value={dashboardMetrics.accountBalance}
          />
          <StatCardV2
            title="Receitas do Mês"
            mainValue={dashboardMetrics.paidMonthlyIncome}
            mainColor="text-green-600"
            sub1Title="Previstas"
            sub1Value={dashboardMetrics.pendingMonthlyIncome}
            sub2Title="Balanço"
            sub2Value={dashboardMetrics.paidMonthlyIncome - dashboardMetrics.paidMonthlyExpense}
          />
          <StatCardV2
            title="Despesas do Mês"
            mainValue={dashboardMetrics.paidMonthlyExpense}
            mainColor="text-red-600"
            sub1Title="Previstas"
            sub1Value={dashboardMetrics.pendingMonthlyExpense}
            sub2Title="Orçado"
            sub2Value={dashboardMetrics.totalMonthlyBudget}
          />
        </div>

        {/* ########## ESTRUTURA DE LAYOUT ATUALIZADA ########## */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          {/* Coluna da Esquerda (mais larga) */}
          <div className="lg:col-span-3 space-y-8">
            <BudgetAnalysis />
          </div>
          {/* Coluna da Direita (mais estreita) */}
          <div className="lg:col-span-2">
            <CreditCardBills />
          </div>
        </div>
      </div>

      {/* Modais (sem alterações) */}
      {(isAddModalOpen || editingTransaction) && (
        <AddTransactionForm
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
          transactionToEdit={editingTransaction}
          categories={categories}
        />
      )}
      {isCategoryModalOpen && (
        <CategoryManager
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Dashboard;

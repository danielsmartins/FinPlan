import { useState, useEffect, useCallback, useMemo } from 'react';
import { getDashboardData } from '../services/dashboard.service';
import { deleteTransaction } from '../services/transaction.service';

import AddTransactionForm from './AddTransactionForm';
import DashboardHeader from './DashboardHeader';
import BudgetAnalysis from './BudgetAnalysis';
import TransactionList from './TransactionList';
import StatCardV2 from './StatCardV2';
import { BanknotesIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';

function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  console.log(categories)

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { transactions, categories, investments, budgets, creditCards } = await getDashboardData();
      setTransactions(transactions);
      setCategories(categories);
      setInvestments(investments);
      setBudgets(budgets);
      setCreditCards(creditCards);
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
    
     const totalInvested = investments.reduce((sum, inv) => sum + (parseFloat(inv.quantity) * parseFloat(inv.currentPrice)), 0);
    const accountBalance = paidTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0) - paidTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const totalPatrimony = totalInvested + accountBalance;
    const paidMonthlyIncome = paidTransactions.filter(t => t.type === 'INCOME' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const pendingMonthlyIncome = transactions.filter(t => t.status === 'PENDING' && t.type === 'INCOME' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const paidMonthlyExpense = paidTransactions.filter(t => t.type === 'EXPENSE' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const pendingMonthlyExpense = transactions.filter(t => t.status === 'PENDING' && t.type === 'EXPENSE' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    const budgetAnalysisData = categories.map(category => {
        const budgetForCategory = budgets.find(b => b.categoryId === category.id);
        const budgetedAmount = budgetForCategory ? budgetForCategory.amount : 0;
        const spentAmount = paidTransactions.filter(t => t.categoryId === category.id && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((sum, t) => sum + t.amount, 0);
        return { id: category.id, name: category.name, icon: category.icon, budgeted: budgetedAmount, spent: spentAmount, percentage: budgetedAmount > 0 ? (spentAmount / budgetedAmount) * 100 : 0 };
    }).filter(item => item.budgeted > 0 || item.spent > 0).sort((a, b) => b.spent - a.spent);

    const creditCardBills = creditCards.map(card => {
        const today = new Date();
        const closingDay = card.closingDay;
        let startDate, endDate, dueDate;
        if (today.getDate() > closingDay) {
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, closingDay + 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), closingDay);
            dueDate = new Date(today.getFullYear(), today.getMonth(), card.dueDay);
        } else {
            startDate = new Date(today.getFullYear(), today.getMonth() - 2, closingDay + 1);
            endDate = new Date(today.getFullYear(), today.getMonth() - 1, closingDay);
            dueDate = new Date(today.getFullYear(), today.getMonth() -1, card.dueDay);
        }
        const billAmount = transactions.filter(t => t.creditCardId === card.id && new Date(t.date) >= startDate && new Date(t.date) <= endDate).reduce((sum, t) => sum + t.amount, 0);
        return { id: card.id, name: card.name, amount: billAmount, dueDate: dueDate };
    });

    return { totalPatrimony, totalInvested, accountBalance, paidMonthlyIncome, pendingMonthlyIncome, paidMonthlyExpense, pendingMonthlyExpense, totalMonthlyBudget, budgetAnalysisData, creditCardBills };
  }, [transactions, categories, investments, budgets, creditCards]);



  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar este lançamento?')) {
      try {
        await deleteTransaction(id);
        fetchDashboardData();
      } catch (err) {
        console.error("Erro ao apagar o lançamento:", err);
        alert("Não foi possível apagar o lançamento.");
      }
    }
  };

 

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-slate-100"><p className="text-gray-500">A carregar dados...</p></div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-slate-100"><p className="p-8 text-center text-red-600">{error}</p></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
      <DashboardHeader  />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatCardV2 
            title="Património Total" 
            mainValue={dashboardMetrics.totalPatrimony} 
            sub1Title="Investido" 
            sub1Value={dashboardMetrics.totalInvested} 
            sub2Title="Saldo em Conta" 
            sub2Value={dashboardMetrics.accountBalance}
            icon={BanknotesIcon}
          />
          <StatCardV2 
            title="Receitas do Mês" 
            mainValue={dashboardMetrics.paidMonthlyIncome} 
            mainColor="text-green-600" 
            sub1Title="Previstas" 
            sub1Value={dashboardMetrics.pendingMonthlyIncome} 
            sub2Title="Balanço" 
            sub2Value={dashboardMetrics.paidMonthlyIncome - dashboardMetrics.paidMonthlyExpense}
            icon={ArrowUpCircleIcon}
          />
          <StatCardV2 
            title="Despesas do Mês" 
            mainValue={dashboardMetrics.paidMonthlyExpense} 
            mainColor="text-red-600" 
            sub1Title="Previstas" 
            sub1Value={dashboardMetrics.pendingMonthlyExpense} 
            sub2Title="Orçado" 
            sub2Value={dashboardMetrics.totalMonthlyBudget}
            icon={ArrowDownCircleIcon}
          />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        <div className="lg:col-span-3 space-y-8">
          <BudgetAnalysis data={dashboardMetrics.budgetAnalysisData} />
         
        </div>
        <div className="lg:col-span-2 space-y-8">
          <TransactionList
            transactions={transactions.slice(0, 10)}
           
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

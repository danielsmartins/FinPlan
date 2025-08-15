

import { useState, useEffect, useMemo } from 'react';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../services/investment.service';

import InvestmentSummaryCards from '../components/InvestmentSummaryCards';
import InvestmentTable from '../components/InvestmentTable';
import InvestmentFormModal from '../components/InvestmentFormModal';


function InvestmentsPage() {

  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);


  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error("Erro ao carregar investimentos:", error);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 


  const summaryData = useMemo(() => {
    if (investments.length === 0) {
      return { totalInvested: 0, currentValue: 0, totalProfit: 0, profitPercentage: 0 };
    }
    

    const numericInvestments = investments.map(inv => ({
      ...inv,
      quantity: parseFloat(inv.quantity),
      averageCost: parseFloat(inv.averageCost),
      currentPrice: parseFloat(inv.currentPrice),
    }));

    const totalInvested = numericInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.averageCost), 0);
    const currentValue = numericInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
    const totalProfit = currentValue - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    
    return { totalInvested, currentValue, totalProfit, profitPercentage };
  }, [investments]);



  const handleOpenCreateModal = () => {
    setSelectedInvestment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (investment) => {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestment(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedInvestment) {

        await updateInvestment(selectedInvestment.id, formData);
      } else {
        // Criar um novo investimento
        await createInvestment(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar investimento:", error);

    }
  };
  
  const handleDelete = async (id) => {
      if(window.confirm("Tem certeza que deseja apagar este ativo?")) {
          try {
              await deleteInvestment(id);
              fetchData(); 
          } catch(error) {
              console.error("Erro ao apagar ativo", error);
          }
      }
  }


  if (isLoading) {
    return <div className="p-8 text-center">Carregando investimentos...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Meus Investimentos</h1>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
        >
          Adicionar Ativo
        </button>
      </div>
      
      <InvestmentSummaryCards data={summaryData} />


      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Ativos</h2>
        <InvestmentTable 
            investments={investments} 
            onEdit={handleOpenEditModal} 
            onDelete={handleDelete} 
        />
      </div>


      <InvestmentFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave} 
        investment={selectedInvestment} 
      />
    </div>
  );
}

export default InvestmentsPage;

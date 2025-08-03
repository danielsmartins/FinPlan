import api from './api';

export const getBudgets = async (month, year) => {
  try {
    const response = await api.get('/budgets', { params: { month, year } });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error.response?.data || error.message);
    throw error;
  }
};


export const upsertBudget = async (budgetData) => {
  try {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar orçamento:", error.response?.data || error.message);
    throw error;
  }
};

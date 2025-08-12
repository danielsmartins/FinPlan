import api from './api';

export const getInvestments = async () => {
  try {
    const response = await api.get('/investments');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error.response?.data || error.message);
    throw error;
  }
};


export const createInvestment = async (investmentData) => {
  try {
    const response = await api.post('/investments', investmentData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar investimento:", error.response?.data || error.message);
    throw error;
  }
};


export const updateInvestment = async (id, investmentData) => {
  try {
    const response = await api.put(`/investments/${id}`, investmentData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar investimento:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteInvestment = async (id) => {
  try {
    await api.delete(`/investments/${id}`);
  } catch (error) {
    console.error("Erro ao deletar investimento:", error.response?.data || error.message);
    throw error;
  }
};
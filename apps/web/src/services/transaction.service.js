import api from './api';

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar transação:", error.response?.data || error.message);
    throw error;
  }
};


export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const response = await api.put(`/transactions/${transactionId}`, transactionData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar transação:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteTransaction = async (transactionId) => {
    try {
      await api.delete(`/transactions/${transactionId}`);
    } catch (error) {
      console.error("Erro ao deletar transação:", error.response?.data || error.message);
      throw error;
    }
};

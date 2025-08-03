import api from './api';


export const getCreditCards = async () => {
  try {
    const response = await api.get('/credit-cards');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cartões de crédito:", error.response?.data || error.message);
    throw error;
  }
};


export const createCreditCard = async (cardData) => {
  try {
    const response = await api.post('/credit-cards', cardData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cartão de crédito:", error.response?.data || error.message);
    throw error;
  }
};


export const updateCreditCard = async (id, cardData) => {
    try {
      const response = await api.put(`/credit-cards/${id}`, cardData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cartão de crédito:", error.response?.data || error.message);
      throw error;
    }
  };


export const deleteCreditCard = async (id) => {
  try {
    await api.delete(`/credit-cards/${id}`);
  } catch (error) {
    console.error("Erro ao deletar cartão de crédito:", error.response?.data || error.message);
    throw error;
  }
};

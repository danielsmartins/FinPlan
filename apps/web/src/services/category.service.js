import api from './api';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error.response?.data || error.message);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error.response?.data || error.message);
    throw error;
  }
};

// NOVA FUNÇÃO PARA ATUALIZAR
export const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
      throw error;
    }
};

export const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/categories/${categoryId}`);
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.response?.data || error.message);
    throw error;
  }
};

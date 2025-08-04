import  { useState } from 'react';
import { createCategory, deleteCategory } from '../services/category.service'; // ATUALIZADO
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

function CategoryManager({ categories, onClose, onSuccess }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('O nome da categoria não pode ser vazio.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // ATUALIZADO: Usa a função do serviço
      await createCategory({ name: newCategoryName });
      setNewCategoryName('');
      onSuccess();
    } catch (err) {
      setError('Erro ao adicionar categoria.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Tem certeza? Deletar uma categoria não afeta transações existentes, elas apenas ficarão "Sem Categoria".')) {
      try {
        // ATUALIZADO: Usa a função do serviço
        await deleteCategory(id);
        onSuccess(); 
      } catch (err) {
        alert('Não foi possível deletar a categoria.');
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-30">
      <div className="bg-white p-6 pt-12 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerenciar Categorias</h2>
        
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria"
            className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="submit" disabled={loading} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? '...' : 'Adicionar'}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.length > 0 ? (
            categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-gray-700">{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-4">Nenhuma categoria criada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;

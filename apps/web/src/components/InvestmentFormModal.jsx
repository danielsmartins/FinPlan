

import { useState, useEffect } from 'react';


const tickerBasedTypes = new Set(['ACAO_BR', 'ACAO_EUA', 'FII', 'BDR', 'ETF']);


const investmentTypeLabels = {
  RENDA_FIXA: 'Renda Fixa',
  ACAO_BR: 'Ação BR',
  ACAO_EUA: 'Ação EUA',
  FII: 'FII',
  BDR: 'BDR',
  ETF: 'ETF',
  CRIPTOMOEDA: 'Criptomoeda',
  OUTRO: 'Outro',
};


const investmentTypes = Object.keys(investmentTypeLabels);


const initialState = {
  name: '',
  ticker: '',
  type: 'ACAO_BR', 
  quantity: '',
  averageCost: '',
  currentPrice: '',
};

function InvestmentFormModal({ isOpen, onClose, onSave, investment }) {
  const [formData, setFormData] = useState(initialState);


  useEffect(() => {
    if (investment && isOpen) {

      setFormData({
        name: investment.name,
        ticker: investment.ticker,
        type: investment.type,
        quantity: String(investment.quantity),
        averageCost: String(investment.averageCost),
        currentPrice: String(investment.currentPrice),
      });
    } else {
      setFormData(initialState);
    }
  }, [investment, isOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newState = { ...prev, [name]: value };

      
      if (name === 'ticker' && tickerBasedTypes.has(newState.type)) {
        newState.name = value.toUpperCase(); 
      }

      
      if (name === 'type') {
        if (tickerBasedTypes.has(value)) {
          newState.name = newState.ticker.toUpperCase();
        } else {
          newState.name = '';
        }
      }
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    const dataToSave = {
      ...formData,
      name: formData.name.toUpperCase(), 
      ticker: formData.ticker.toUpperCase(),
      quantity: parseFloat(formData.quantity) || 0,
      averageCost: parseFloat(formData.averageCost) || 0,
      currentPrice: parseFloat(formData.currentPrice) || 0,
    };

    onSave(dataToSave);
  };

  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{investment ? 'Editar Ativo' : 'Adicionar Novo Ativo'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Ativo</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={tickerBasedTypes.has(formData.type)}
              className={`
                mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500
                ${tickerBasedTypes.has(formData.type) ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
            />
          </div>

          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700">Ticker</label>
            <input
              type="text"
              name="ticker"
              id="ticker"
              value={formData.ticker.toUpperCase()}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Investimento</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {investmentTypes.map(type => (
                <option key={type} value={type}>
                  {investmentTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
                <input type="number" step="any" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="averageCost" className="block text-sm font-medium text-gray-700">Preço Médio</label>
                <input type="number" step="any" name="averageCost" id="averageCost" value={formData.averageCost} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700">Cotação Atual</label>
                <input type="number" step="any" name="currentPrice" id="currentPrice" value={formData.currentPrice} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvestmentFormModal;
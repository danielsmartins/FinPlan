import React from 'react';

function BudgetList({ budgetsData, localValues, onBudgetChange, onSaveBudget, totalBudgeted }) {
  
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="md:col-span-2">
      <h3 className="font-semibold text-lg mb-4">Planeamento Mensal</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-500">
          <span>CATEGORIA</span>
          <span className="text-right">ORÇADO</span>
        </div>
        {budgetsData.map(item => (
          <div key={item.id} className="grid grid-cols-2 gap-4 items-center">
            <span className="font-medium flex items-center gap-3">
              <span className="text-xl">{item.icon || '📁'}</span>
              {item.name}
            </span>
            <div className="flex items-center justify-end gap-2">
              <span className="text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={localValues[item.id] ?? ''}
                onChange={(e) => onBudgetChange(item.id, e.target.value)}
                onBlur={() => onSaveBudget(item.id)}
                className="w-32 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t">
          <span className="font-bold text-lg">TOTAL</span>
          <span className="font-bold text-lg text-right">{formatCurrency(totalBudgeted)}</span>
        </div>
      </div>
    </div>
  );
}

export default BudgetList;

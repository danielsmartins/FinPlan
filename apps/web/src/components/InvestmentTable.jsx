// Em web/src/components/InvestmentTable.jsx

import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

// Função auxiliar para formatar moeda
const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function InvestmentTable({ investments, onEdit, onDelete }) {

  // Caso não hajam investimentos, exibe uma mensagem amigável
  if (investments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhum ativo cadastrado ainda.</p>
        <p className="text-gray-400 text-sm mt-1">Clique em "Adicionar Ativo" para começar a acompanhar seus investimentos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ativo</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rentabilidade</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Atual</th>
            <th scope="col" className="px-6 py-3 text-relative text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {investments.map((inv) => {
            // Cálculos para cada linha
            const quantity = parseFloat(inv.quantity);
            const averageCost = parseFloat(inv.averageCost);
            const currentPrice = parseFloat(inv.currentPrice);

            const totalInvested = quantity * averageCost;
            const currentValue = quantity * currentPrice;
            const profit = currentValue - totalInvested;
            const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
            const isPositive = profit >= 0;

            return (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-gray-900">{inv.name}</div>
                  <div className="text-sm text-gray-500">{inv.ticker}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {inv.type.replace('_', ' ')}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <div>{formatCurrency(profit)}</div>
                    <div className="text-sm">({profitPercentage.toFixed(2)}%)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(currentValue)}</div>
                    <div className="text-sm text-gray-500">{quantity} cotas a {formatCurrency(currentPrice)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(inv)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => onDelete(inv.id)} className="text-red-600 hover:text-red-900">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InvestmentTable;
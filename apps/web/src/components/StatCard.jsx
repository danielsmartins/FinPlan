
import React from 'react';

function StatCard({ title, amount, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
        {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>
    </div>
  );
}

export default StatCard;
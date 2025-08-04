import React from 'react';import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D4FF'];

function ProgressBar({ percentage }) {
  const width = Math.min(percentage, 100);
  let colorClass = 'bg-blue-500';
  if (percentage > 80) colorClass = 'bg-yellow-500';
  if (percentage > 100) colorClass = 'bg-red-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${width}%` }}></div>
    </div>
  );
}

function BudgetAnalysis({ data }) {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const chartData = data
    .filter(item => item.spent > 0)
    .map(item => ({ name: item.name, value: item.spent }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
      <h3 className="font-semibold text-gray-800">Análise de Gastos: Orçamento e Categorias</h3>
      
      <div className="w-full h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 px-2">
            <div className="col-span-4">CATEGORIA</div>
            <div className="col-span-3 text-right">ORÇADO</div>
            <div className="col-span-3 text-right">GASTO</div>
            <div className="col-span-2 text-right">% GASTO</div>
          </div>
          
          {data.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-sm border-t pt-2">
              <div className="col-span-4 font-medium text-gray-800 flex items-center gap-3">
                <span className="text-xl">{item.icon || '📁'}</span>
                <span>{item.name}</span>
              </div>
              <div className="col-span-3 text-right text-gray-600">{formatCurrency(item.budgeted)}</div>
              <div className="col-span-3 text-right text-gray-600">{formatCurrency(item.spent)}</div>
              <div className="col-span-2 text-right font-semibold text-gray-800">{`${Math.round(item.percentage)}%`}</div>
              <div className="col-span-12 mt-1">
                <ProgressBar percentage={item.percentage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BudgetAnalysis;

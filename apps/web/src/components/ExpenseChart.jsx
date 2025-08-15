import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartPieIcon } from '@heroicons/react/24/outline';

const COLORS = ['#3b82f6', '#14b8a6', '#f97316', '#8b5cf6', '#ec4899', '#ef4444'];

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm" style={{ color: data.payload.fill }}>
          {data.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
    );
  }
  return null;
};

function ExpenseChart({ data, totalExpenses }) {
  const paddingAngle = data.length > 1 ? 3 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-96 relative">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">Despesas por Categoria</h3>
      {data.length > 0 ? (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-sm text-slate-500">Total de Despesas</p>
            <p className="text-2xl font-bold text-slate-700">
              {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%" 
                innerRadius={80}
                outerRadius={120}
                paddingAngle={paddingAngle}
                labelLine={false}
                label={<CustomPieLabel />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <ChartPieIcon className="w-16 h-16 mb-4" />
          <p className="font-semibold">Nenhuma despesa este mês.</p>
          <p className="text-sm">Adicione uma transação para ver o gráfico.</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;
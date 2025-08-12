const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function InvestmentSummaryCards({ data }) {
  const { totalInvested, currentValue, totalProfit, profitPercentage } = data;
  const isPositive = totalProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Card: Total Investido */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-500 font-medium">Total Investido</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-2">
          {formatCurrency(totalInvested)}
        </p>
      </div>

      {/* Card: Valor Atual */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-500 font-medium">Valor Atual da Carteira</h3>
        <p className="text-2xl font-semibold text-gray-800 mt-2">
          {formatCurrency(currentValue)}
        </p>
      </div>

      {/* Card: Rentabilidade */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-500 font-medium">Rentabilidade Total</h3>
        <div className={`flex items-baseline mt-2`}>
            <p className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfit)}
            </p>
            <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                ({profitPercentage.toFixed(2)}%)
            </span>
        </div>
      </div>
    </div>
  );
}

export default InvestmentSummaryCards;
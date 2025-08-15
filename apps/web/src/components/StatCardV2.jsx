function StatCardV2({ title, mainValue, sub1Title, sub1Value, sub2Title, sub2Value, mainColor = 'text-gray-900', icon: Icon }) {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-500 text-sm">{title}</h3>
          <p className={`text-2xl font-bold mt-2 ${mainColor}`}>{formatCurrency(mainValue)}</p>
        </div>
        {Icon && <Icon className="w-8 h-8 text-gray-300" />}
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{sub1Title}</span>
          <span className="font-medium text-gray-800">{formatCurrency(sub1Value)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{sub2Title}</span>
          <span className="font-medium text-gray-800">{formatCurrency(sub2Value)}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCardV2;

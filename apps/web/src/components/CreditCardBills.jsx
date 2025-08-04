
function CreditCardBills({ creditCardBills }) {
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date) => {
    if (!date) return '-';
    // Adiciona 1 dia para corrigir problemas de fuso horário na exibição
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    return adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
      <h3 className="font-semibold text-gray-800">Gastos com Cartões de Crédito</h3>
      <div className="mt-4 space-y-4">
        {creditCardBills.length > 0 ? (
          creditCardBills.map(bill => (
            <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-800">{bill.name}</p>
                <p className="text-xs text-gray-500">Vencimento: {formatDate(bill.dueDate)}</p>
              </div>
              <p className="font-bold text-lg text-blue-600">{formatCurrency(bill.amount)}</p>
            </div>
          ))
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            <p>Nenhum cartão de crédito cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreditCardBills;

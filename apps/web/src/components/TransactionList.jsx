function TransactionList({ transactions }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">Últimas Transações</h2>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.slice(0, 10).map((t) => (
            <li
              key={t.id}
              className="flex items-center p-2 rounded-md transition-colors hover:bg-slate-100"
            >
              <div className="w-8 h-8 mr-3 text-2xl flex-shrink-0 flex items-center justify-center">
                {t.category?.icon || (t.type === 'INCOME' ? '💰' : '💸')}
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-slate-800 truncate">{t.title}</p>
                <p className="text-sm text-slate-500">{formatDate(t.date)}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <p
                  className={`font-semibold text-right ${
                    t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'INCOME' ? '+ ' : '- '}
                  {t.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 pt-10">
          <p>Nenhuma transação encontrada.</p>
        </div>
      )}
    </div>
  );
}

export default TransactionList;

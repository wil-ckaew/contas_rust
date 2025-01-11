import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SelectMonthPage: React.FC = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const handleSelectMonth = () => {
    if (!selectedMonth) {
      alert('Por favor, selecione um mês.');
      return;
    }
    router.push(`/accounts?month=${selectedMonth}`);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-100">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
            Selecione um Mês
          </h1>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          >
            <option value="" disabled>
              Escolha um mês
            </option>
            {Array.from({ length: 12 }).map((_, index) => {
              const month = (index + 1).toString().padStart(2, '0');
              return (
                <option key={month} value={month}>
                  {new Date(0, index).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              );
            })}
          </select>
          <button
            onClick={handleSelectMonth}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md w-full"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMonthPage;

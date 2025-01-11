import React, { useState } from "react";
import { useRouter } from "next/router";

const MonthSelector: React.FC = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const handleRedirect = () => {
    if (selectedMonth) {
      router.push(`/accounts?month=${selectedMonth}`);
    } else {
      alert("Por favor, selecione um mês.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Selecione o Mês</h1>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        >
          <option value="" disabled>
            Escolha um mês
          </option>
          {[
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ].map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
        <button
          onClick={handleRedirect}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md focus:outline-none"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default MonthSelector;

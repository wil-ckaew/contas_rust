// src/pages/accounts/add-accont.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../components/Header';

const AddAccountPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    due_date: '',
    paid: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const { name, value, due_date } = formData;
    if (!name || !value || !due_date) {
      setError('Todos os campos são obrigatórios!');
      return false;
    }

    if (isNaN(Number(value)) || Number(value) <= 0) {
      setError('O valor deve ser um número positivo.');
      return false;
    }

    if (!/\d{4}-\d{2}-\d{2}/.test(due_date)) {
      setError('A data deve estar no formato AAAA-MM-DD.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const formattedData = {
        ...formData,
        value: parseFloat(formData.value), // Certifique-se de que o valor seja numérico
        due_date: `${formData.due_date}T00:00:00Z`, // Formato ISO
      };

      await axios.post(`${apiUrl}/api/accounts`, formattedData);
      router.push('/accounts/accounts');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(`Erro ao adicionar conta: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-100">
      <Header />
      <main className="flex flex-1 justify-center items-center py-6">
        <section className="w-full max-w-xl p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Adicionar Conta</h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Nome da Conta</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Valor</label>
              <input
                type="number"
                step="0.01"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Data de Vencimento</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Status de Pagamento</label>
              <input
                type="checkbox"
                name="paid"
                checked={formData.paid}
                onChange={handleChange}
                className="w-6 h-6 text-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Adicionar Conta
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddAccountPage;

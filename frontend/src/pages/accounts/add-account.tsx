// src/pages/accounts/add-accont.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/Header'; // Adicionar o Header

const AddAccontPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [due_date, setDate] = useState('');
  const [paid, setPaid] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('/api/accounts', { name, value, due_date, paid });
      router.push('/accounts');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error adding accounts: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <h2 className="text-2xl font-bold mb-4">Add Contas</h2>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contas</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="text"
                value={due_date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Paid</label>
              <input
                type="text"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm"
            >
              Add Accont
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddAccontPage;

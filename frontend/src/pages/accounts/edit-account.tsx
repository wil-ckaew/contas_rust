// src/pages/acconts/edit-accont/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../components/Header';

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  created_at?: string | null;
}

const EditAccountPage: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const router = useRouter();
  const { id } = router.query;

  const [account, setAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    value: number;
    due_date: string;
    paid: boolean;
  }>({
    name: '',
    value: 0,
    due_date: '',
    paid: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchAccount = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/accounts/${id}`);
          setAccount(response.data.account);
          setFormData({
            name: response.data.account.name,
            value: response.data.account.value,
            due_date: response.data.account.due_date.split('T')[0], // Ajuste para data
            paid: response.data.account.paid,
          });
          setError(null);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(`Error fetching account data: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      };

      fetchAccount();
    }
  }, [id, apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && account) {
      try {
        // Converte a data para o formato "YYYY-MM-DDT00:00:00Z"
        const updatedFormData = {
          ...formData,
          due_date: `${formData.due_date}T00:00:00Z`,
        };

        // Envia os dados para a API
        await axios.patch(`${apiUrl}/api/accounts/${id}`, updatedFormData);

        alert('Account updated successfully');
        router.push('/accounts/accounts'); // Redireciona após a atualização
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Error updating account: ${errorMessage}`);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col h-screen bg-blue-100"> {/* Altere a cor de fundo para bg-blue-100 */}
      <Header />
      <main className="flex flex-1 justify-center items-center py-6">
        <section className="w-full max-w-xl p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Account</h1>
          {account && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="value" className="block text-gray-700 font-medium">Value</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="due_date" className="block text-gray-700 font-medium">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="paid" className="block text-gray-700 font-medium">Paid</label>
                <input
                  type="checkbox"
                  id="paid"
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
                Update Account
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default EditAccountPage;

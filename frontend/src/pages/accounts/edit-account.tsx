// src/pages/acconts/edit-accont/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/axiosConfig'; // Importa a instância configurada
import { AxiosError } from 'axios';
import Header from '../../components/Header'; // Importa o Header

interface Accont {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  created_at?: string | null;
}

const EditAccontPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [accont, setAccont] = useState<Accont | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; value: string; due_date: string; paid: string }>({
    name: '',
    value: '',
    due_date: '',
    paid: ''
  });

  useEffect(() => {
    if (id) {
      const fetchAccont = async () => {
        try {
          const response = await api.get(`/api/acconts/${id}`);
          setAccont(response.data.accont);
          setFormData({
            name: response.data.accont.name,
            value: response.data.accont.value,
            due_date: response.data.accont.due_date,
            paid: response.data.accont.paid
          });
          setError(null);
        } catch (error) {
          if (error instanceof AxiosError) {
            setError(`Error fetching accont data: ${error.message}`);
          } else {
            setError('Unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchAccont();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/api/acconts/${id}`, formData); // Método PATCH
      alert('Accont updated successfully');
      router.push('/acconts/acconts'); // Redireciona após a atualização para a URL correta
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(`Error updating accont: ${error.message}`);
      } else {
        alert('Error updating accont: Unknown error');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col h-screen">
      <Header /> {/* Adiciona o Header */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <h1 className="text-xl font-semibold mb-4">Edit Accont</h1>
        {accont && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">Contas</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="value" className="block text-gray-700">Valor</label>
              <input
                type="value"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="due_date" className="block text-gray-700">Data</label>
              <input
                type="text"
                id="data"
                name="data"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="paid" className="block text-gray-700">Paid</label>
              <input
                type="text"
                id="paid"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Accont
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default EditAccontPage;

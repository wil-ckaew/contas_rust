// src/pages/accounts/accounts.tsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig'; // Importa a instância configurada
import AccountCardComponent from '../../components/AccountCardComponent';
import Header from '../../components/Header'; // Importa o Header
import { useRouter } from 'next/router';
import { AxiosError } from 'axios'; // Importa AxiosError para manipulação de erros

interface account {
    id: string;
    name: string;
    value: number;
    due_date: string;
    paid: boolean;
    created_at?: string | null;
}

const accountsPage: React.FC = () => {
  const router = useRouter();

  const [accounts, setaccounts] = useState<account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/accounts');
        setaccounts(response.data.accounts || []);
        setError(null);
      } catch (error) {
        // Verifica se o erro é uma instância de AxiosError
        if (error instanceof AxiosError) {
          setError(`Error fetching accounts: ${error.message}`);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddaccount = () => {
    router.push('/accounts/add-account'); // Rota para adicionar um pai
  };

  const handleEdit = (id: string) => {
    router.push(`/accounts/edit-account?id=${id}`); // Rota para edição de um pai
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await api.delete(`/api/accounts/${id}`);
        setaccounts(accounts.filter(account => account.id !== id));
        alert('account deleted successfully');
      } catch (error) {
        if (error instanceof AxiosError) {
          alert(`Error deleting account: ${error.message}`);
        } else {
          alert('Error deleting account: Unknown error');
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header /> {/* Adiciona o Header */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-800 font-semibold">Minhas Despesas</p>
          <button
            onClick={handleAddaccount}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add account
          </button>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="space-y-4">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <AccountCardComponent
                  key={account.id}
                  account={account}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No accounts available</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default accountsPage;

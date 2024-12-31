// src/pages/accounts/accounts.tsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import AccountCardComponent from '../../components/AccountCardComponent';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  created_at?: string | null;
}

const AccountsPage: React.FC = () => {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/accounts');
        setAccounts(response.data.accounts || []);
        setError(null);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(`Erro ao buscar contas: ${error.message}`);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAccount = () => {
    router.push('/accounts/add-account');
  };

  const handleEdit = (id: string) => {
    router.push(`/accounts/edit-account?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await api.delete(`/api/accounts/${id}`);
        setAccounts(accounts.filter(account => account.id !== id));
        alert('Conta excluída com sucesso');
      } catch (error) {
        if (error instanceof AxiosError) {
          alert(`Erro ao excluir a conta: ${error.message}`);
        } else {
          alert('Erro ao excluir a conta: erro desconhecido');
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-100">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          {/* Cabeçalho dentro do painel */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-3xl font-semibold text-blue-700">Minhas Despesas</p>
            <button
              onClick={handleAddAccount}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md focus:outline-none"
            >
              Adicionar Conta
            </button>
          </div>

          {/* Seção de contas */}
          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
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
                <p className="text-center text-gray-600">Nenhuma conta disponível</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountsPage;

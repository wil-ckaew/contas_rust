// src/pages/accounts/accounts.tsx

import React, { useState, useEffect } from "react";
import { api, remindersApi  }from "../../utils/axiosConfig"; // Para a API principal
//import remindersApi from "../../utils/axiosRemindersConfig"; // Para a API Python
import AccountCardComponent from "../../components/AccountCardComponent";
import Header from "../../components/Header";
import Reminders from "../../components/Reminders";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  prediction?: string;
  created_at?: string | null;
}

const AccountsPage: React.FC = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estado para busca
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para o painel de predição
  const [isPredictModalOpen, setPredictModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [value, setValue] = useState<number | null>(null);

  // Função para buscar as contas
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get<{ accounts: Account[] }>("/api/accounts");
        setAccounts(response.data.accounts || []);
        setFilteredAccounts(response.data.accounts || []);
        setError(null);
      } catch (error) {
        const errMessage =
          error instanceof AxiosError
            ? `Erro ao buscar contas: ${error.message}`
            : "Erro desconhecido ao buscar contas";
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Atualiza a lista filtrada com base na busca
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = accounts.filter((account) =>
      account.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1); // Reseta para a primeira página ao buscar
  }, [searchQuery, accounts]);

  // Funções de navegação
  const handleAddAccount = () => router.push("/accounts/add-account");
  const handleEdit = (id: string) => router.push(`/accounts/edit-account?id=${id}`);

  // Função para excluir uma conta
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      try {
        await api.delete(`/api/accounts/${id}`);
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
        alert("Conta excluída com sucesso.");
      } catch (error) {
        const errMessage =
          error instanceof AxiosError
            ? `Erro ao excluir a conta: ${error.message}`
            : "Erro desconhecido ao excluir a conta.";
        alert(errMessage);
      }
    }
  };

  // Abrir painel para predição
  const openPredictModal = (id: string) => {
    setSelectedAccountId(id);
    setPredictModalOpen(true);
  };

  // Fechar painel de predição
  const closePredictModal = () => {
    setSelectedAccountId(null);
    setDueDate("");
    setValue(null);
    setPredictModalOpen(false);
  };

  // Função para enviar predição
  const handlePredictPayment = async () => {
    if (!selectedAccountId || !dueDate || value === null) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const response = await remindersApi.post<{ prediction: string }>(
        `/api/accounts/${selectedAccountId}/predict_payment`,
        {
          account_id: selectedAccountId,
          due_date: dueDate,
          valor: value,
        }
      );

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === selectedAccountId
            ? { ...account, prediction: response.data.prediction }
            : account
        )
      );

      alert(`Predição de pagamento: ${response.data.prediction}`);
      closePredictModal();
    } catch (error) {
      const errMessage =
        error instanceof AxiosError
          ? `Erro na predição: ${error.response?.data.error || error.message}`
          : "Erro desconhecido na predição.";
      alert(errMessage);
    }
  };

  // Paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  return (
    <div className="flex flex-col h-screen bg-blue-100">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-blue-700">Minhas Despesas</h1>
            <button
              onClick={handleAddAccount}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md focus:outline-none"
            >
              Adicionar Conta
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar contas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <Reminders />

          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : paginatedAccounts.length > 0 ? (
            <div className="space-y-4">
              {paginatedAccounts.map((account) => (
                <AccountCardComponent
                  key={account.id}
                  account={account}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPredict={() => openPredictModal(account.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Nenhuma conta disponível.</p>
          )}

          {/* Controles de paginação */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-blue-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </main>

      {/* Painel de Predição */}
      {isPredictModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Predizer Pagamento</h2>
            <div className="mb-4">
              <label className="block text-gray-700">ID da Conta</label>
              <p className="text-gray-900">{selectedAccountId}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Data de Vencimento</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Valor</label>
              <input
                type="number"
                value={value || ""}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closePredictModal}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handlePredictPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;

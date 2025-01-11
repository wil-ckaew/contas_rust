// src/pages/accounts/accounts.tsx
import React, { useState, useEffect } from "react";
import { api, remindersApi } from "../../utils/axiosConfig";
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
const formatDate = (date: string): string => {
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const AccountsPage: React.FC = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [searchQuery, setSearchQuery] = useState("");
  const [isPredictModalOpen, setPredictModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [value, setValue] = useState<number | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showReminders, setShowReminders] = useState<boolean>(true);

  // Fetch accounts based on the selected month
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!selectedMonth) return;

      setLoading(true);
      try {
        const response = await api.get<{ accounts: Account[] }>("/api/accounts", {
          params: { month: selectedMonth },
        });
        setAccounts(response.data.accounts || []);
        setFilteredAccounts(response.data.accounts || []);
        setError(null);
        setShowReminders(false);
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
  }, [selectedMonth]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = accounts.filter((account) =>
      account.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [searchQuery, accounts]);

  const handleAddAccount = () => router.push("/accounts/add-account");
  const handleEdit = (id: string) => router.push(`/accounts/edit-account?id=${id}`);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      try {
        await api.delete(`/api/accounts/${id}`);
        setAccounts((prev) => prev.filter((account) => account.id !== id));
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

  const openPredictModal = (id: string) => {
    setSelectedAccountId(id);
    setPredictModalOpen(true);
  };

  const closePredictModal = () => {
    setSelectedAccountId(null);
    setDueDate("");
    setValue(null);
    setPredictModalOpen(false);
  };

  const handlePredictPayment = async () => {
    if (!selectedAccountId || !dueDate || !value) {
      alert("Preencha todos os campos para realizar a predição.");
      return;
    }

    try {
      const account = accounts.find((acc) => acc.id === selectedAccountId);
      if (!account) {
        alert("Conta não encontrada.");
        return;
      }

      const response = await remindersApi.post(`/api/accounts/${selectedAccountId}/predict_payment`, {
        valor: value,
        due_date: dueDate,
      });

      const { prediction } = response.data;

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === selectedAccountId
            ? {
                ...account,
                prediction,
                paid: true,
                due_date: dueDate,
              }
            : account
        )
      );

      closePredictModal();
      alert(`Predição realizada para a conta ${account.name}: ${prediction}`);
    } catch (error) {
      alert("Erro ao realizar a predição.");
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
    setAccounts([]);
    setSearchQuery("");
    setShowReminders(true);
  };

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
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Selecione um mês:</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                  {new Date(0, i).toLocaleString("pt-BR", { month: "long" })}
                </option>
              ))}
            </select>
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

          {showReminders && <Reminders />}

          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : paginatedAccounts.length > 0 ? (
            paginatedAccounts.map((account) => (
              <AccountCardComponent
                key={account.id}
                account={{
                  ...account,
                  due_date: formatDate(account.due_date), // Format the due_date
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPredict={() => openPredictModal(account.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">Nenhuma conta disponível.</p>
          )}

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

      {isPredictModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Predição de Pagamento</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePredictPayment();
              }}
            >
              {/* Exibindo o nome da conta */}
              <div className="mb-4">
                <label className="block text-gray-700">Conta</label>
                <p className="text-gray-900">{accounts.find((account) => account.id === selectedAccountId)?.name}</p>
              </div>

              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-gray-700">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-gray-700">
                  Valor
                </label>
                <input
                  type="number"
                  id="value"
                  value={value ?? ""}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closePredictModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;

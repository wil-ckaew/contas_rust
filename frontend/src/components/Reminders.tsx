//components/Reminders.tsx
import React, { useState, useEffect } from "react";
import { remindersApi } from "../utils/axiosConfig";
import { AxiosError } from "axios";

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [remindersPerPage] = useState<number>(5); // Número de lembretes por página
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<any | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await remindersApi.get("/api/reminders");
        setReminders(response.data.reminders || []);
        setError(null);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(
            `Erro ao buscar lembretes: ${error.response?.status} - ${
              error.response?.statusText || error.message
            }`
          );
        } else {
          setError("Erro desconhecido ao buscar lembretes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleReminderClick = (reminder: any) => {
    setSelectedReminder(reminder);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedReminder(null); // Reseta a seleção ao trocar de página
  };

  // Calcular lembretes da página atual
  const indexOfLastReminder = currentPage * remindersPerPage;
  const indexOfFirstReminder = indexOfLastReminder - remindersPerPage;
  const currentReminders = reminders.slice(indexOfFirstReminder, indexOfLastReminder);

  // Total de páginas
  const totalPages = Math.ceil(reminders.length / remindersPerPage);

  if (loading) {
    return <p>Carregando lembretes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Conteúdo Principal */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flex: 1,
          overflow: "auto",
        }}
      >
        {/* Lista de Lembretes */}
        <div style={{ flex: 2, overflowY: "auto" }}>
          <h3>Lembretes Pendentes</h3>
          {currentReminders.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {currentReminders.map((reminder, index) => (
                <li
                  key={index}
                  onClick={() => handleReminderClick(reminder)}
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {reminder.name} - {reminder.due_date}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum lembrete encontrado.</p>
          )}

          {/* Paginação */}
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: currentPage === index + 1 ? "#007bff" : "#f0f0f0",
                  color: currentPage === index + 1 ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Lembrete */}
        <div
          style={{
            flex: 1, // Ocupa menos espaço em relação à lista
            border: "1px solid #ccc",
            padding: "15px", // Diminui o padding para deixar menor
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            maxHeight: "250px", // Diminui a altura máxima
          }}
        >
          {selectedReminder ? (
            <div>
              <h4>Detalhes do Lembrete</h4>
              <p>
                <strong>Nome:</strong> {selectedReminder.name}
              </p>
              <p>
                <strong>Valor:</strong> R$ {selectedReminder.value.toFixed(2)}
              </p>
              <p>
                <strong>Data de Vencimento:</strong> {selectedReminder.due_date}
              </p>
              <p>
                <strong>Pago:</strong> {selectedReminder.paid ? "Sim" : "Não"}
              </p>
            </div>
          ) : (
            <p>Selecione um lembrete para ver os detalhes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;

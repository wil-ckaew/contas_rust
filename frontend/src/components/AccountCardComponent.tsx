// src/components/AccountCardComponent.tsx
import React, { useState } from 'react';

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  prediction?: string;
  created_at?: string | null;
}

interface AccountCardProps {
  account: Account;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPredict: (id: string, value: number, due_date: string) => void;
}

const AccountCardComponent: React.FC<AccountCardProps> = ({ account, onEdit, onDelete, onPredict }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 space-y-4">
      <div className="grid grid-cols-4 gap-4 items-center cursor-pointer" onClick={toggleExpand}>
        <span className="text-gray-800 font-semibold">{account.name}</span>
        <span className="text-gray-600">R$ {account.value.toFixed(2)}</span>
        <span className="text-gray-600">{account.due_date}</span>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();  // Previne que o clique no botão também dispare a expansão
              onEdit(account.id);
            }}
            className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-300"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();  // Previne que o clique no botão também dispare a expansão
              onDelete(account.id);
            }}
            className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
          >
            Excluir
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();  // Previne que o clique no botão também dispare a expansão
              onPredict(account.id, account.value, account.due_date);
            }}
            className="text-green-500 hover:text-green-700 focus:outline-none transition-colors duration-300"
          >
            Predizer Pagamento
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <p>
            <strong>Pago:</strong> {account.paid ? 'Sim' : 'Não'}
          </p>
          {account.created_at && (
            <p>
              <strong>Criado em:</strong> {new Date(account.created_at).toLocaleDateString()}
            </p>
          )}
          {account.prediction && (
            <p>
              <strong>Predição:</strong> {account.prediction === 'pago' ? 'Será Pago' : 'Não Será Pago'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountCardComponent;

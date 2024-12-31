// src/components/AccountCardComponent.tsx
import React, { useState } from 'react';

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  created_at?: string | null;
}

interface AccountCardProps {
  account: Account;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AccountCardComponent: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-2">
      <div className="grid grid-cols-4 gap-4 items-center cursor-pointer" onClick={toggleExpand}>
        <span className="text-gray-800 font-semibold">{account.name}</span>
        <span className="text-gray-600">R$ {account.value.toFixed(2)}</span>
        <span className="text-gray-600">{account.due_date}</span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita a propagação do evento para o clique no nome
              onEdit(account.id);
            }}
            className="text-blue-500 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita a propagação do evento para o clique no nome
              onDelete(account.id);
            }}
            className="text-red-500 hover:underline"
          >
            Excluir
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-2 bg-gray-100 p-3 rounded-lg">
          <p>
            <strong>Pago:</strong> {account.paid ? 'Sim' : 'Não'}
          </p>
          {account.created_at && (
            <p>
              <strong>Criado em:</strong> {new Date(account.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountCardComponent;

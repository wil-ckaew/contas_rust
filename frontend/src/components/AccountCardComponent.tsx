// src/components/AccountCardComponent.tsx
import React from 'react';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    value: number;
    due_date: string;
    paid: boolean;
    created_at?: string | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AccountCardComponent: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 flex justify-between items-center">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">Conta: {account.name}</h3>
        <p className="text-gray-600">Valor: {account.value}</p>
        <p className="text-gray-600">Data: {account.due_date}</p>
        <p className="text-gray-600">Paid: {account.paid}</p>
        <p className="text-gray-600">Data Atual: {account.created_at}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={() => onEdit(account.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(account.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AccountCardComponent;

// src/components/AccountCardComponent.tsx
import React, { useState } from 'react';

interface Account {
  id: string;
  name: string;
  value: number;
  due_date: string;
  paid: boolean;
  prediction?: string;
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
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-2">
      <div onClick={toggleExpand}>
        <h3>{account.name}</h3>
        <p>Valor: R$ {account.value.toFixed(2)}</p>
        <p>Vencimento: {account.due_date}</p>
      </div>
      {isExpanded && (
        <div>
          <p>Pago: {account.paid ? 'Sim' : 'Não'}</p>
          {account.prediction && <p>Predição: {account.prediction}</p>}
        </div>
      )}
      <button onClick={() => onEdit(account.id)}>Editar</button>
      <button onClick={() => onDelete(account.id)}>Excluir</button>
      <button onClick={() => onPredict(account.id, account.value, account.due_date)}>Predizer</button>
    </div>
  );
};

export default AccountCardComponent;

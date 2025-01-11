import React from 'react';

interface PredictionCardProps {
  prediction: string;
  dueDate: string;
}

const PredictionCardComponent: React.FC<PredictionCardProps> = ({ prediction, dueDate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <p className="text-xl font-semibold text-gray-800">Previsão de Pagamento</p>
      <p className="text-sm text-gray-500">Vencimento: {new Date(dueDate).toLocaleDateString()}</p>
      <div className={`mt-2 p-3 text-center rounded-lg ${prediction === 'pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {prediction === 'pago' ? 'Pagamento realizado' : 'Pagamento pendente'}
      </div>
    </div>
  );
};

export default PredictionCardComponent;

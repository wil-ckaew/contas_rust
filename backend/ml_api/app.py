#backend/ml_api/app.py
# servidor Flask para a API,  servidor Flask para expor o modelo de IA via uma API
from flask import Flask, jsonify, request
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Carregando o modelo treinado
model = joblib.load('account_payment_model.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extraindo dados da requisição
    valor = data['valor']
    due_date = pd.to_datetime(data['due_date']).timestamp()

    # Realizando a previsão
    prediction = model.predict([[valor, due_date]])

    return jsonify({'prediction': 'pago' if prediction[0] == 1 else 'não pago'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

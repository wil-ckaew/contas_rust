# modelo de IA, usando scikit-learn para treinar um modelo baseado no histórico de pagamentos
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Exemplo de dados fictícios
data = {
    'valor': [100, 200, 150, 50, 300],
    'due_date': ['2024-12-05', '2024-12-10', '2024-12-15', '2024-12-20', '2024-12-25'],
    'paid': [1, 0, 1, 0, 1]  # 1 significa pago, 0 significa não pago
}

# Criando DataFrame
df = pd.DataFrame(data)

# Preprocessamento
df['due_date'] = pd.to_datetime(df['due_date'])
df['due_date'] = df['due_date'].map(lambda x: x.timestamp())  # Convertendo para timestamp
X = df[['valor', 'due_date']]
y = df['paid']

# Dividindo os dados em treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treinando o modelo
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Salvando o modelo
joblib.dump(model, 'account_payment_model.joblib')

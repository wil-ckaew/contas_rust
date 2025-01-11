# backend/ml_api/app.py
# Servidor Flask para expor o modelo de IA via uma API
from flask import Flask, Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4
import os
import joblib
import logging
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do log
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Inicializar o Flask e o CORS
app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 'postgresql://ckaew:senha123@localhost:6500/dbcontas'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Carregar o modelo
model_path = 'account_payment_model.joblib'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    logger.error("Modelo não encontrado em: %s", model_path)
    raise FileNotFoundError(f"Modelo não encontrado em: {model_path}")

# Modelos do banco de dados
class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(255), nullable=False)
    value = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    paid = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class PaymentPrediction(db.Model):
    __tablename__ = 'payment_predictions'
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid4()))
    account_id = db.Column(db.String, db.ForeignKey('accounts.id', ondelete='CASCADE'), nullable=False)
    prediction = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='pending')
    predicted_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Blueprint para rotas
api = Blueprint('api', __name__)

# Rotas da API
@api.route('/accounts/<string:account_id>/predict_payment', methods=['POST'])
def predict_payment(account_id):
    try:
        data = request.get_json()
        if not data or 'valor' not in data or 'due_date' not in data:
            return jsonify({'error': 'Campos "valor" e "due_date" são obrigatórios.'}), 400

        valor = float(data['valor'])
        due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').timestamp()

        # Predição usando o modelo carregado
        prediction = model.predict([[valor, due_date]])
        prediction_label = 'pago' if prediction[0] == 1 else 'não pago'

        # Salvar a predição no banco de dados
        prediction_entry = PaymentPrediction(
            account_id=account_id,
            prediction=prediction_label,
            status='success'
        )
        db.session.add(prediction_entry)
        db.session.commit()

        return jsonify({
            'account_id': account_id,
            'valor': valor,
            'due_date': data['due_date'],
            'prediction': prediction_label
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error("Erro no banco de dados: %s", e)
        return jsonify({'error': 'Erro no banco de dados.', 'details': str(e)}), 500
    except Exception as e:
        logger.error("Erro inesperado: %s", e)
        return jsonify({'error': 'Erro inesperado.', 'details': str(e)}), 500

@api.route('/reminders', methods=['GET'])
def get_reminders():
    try:
        reminders = Account.query.all()
        result = [
            {
                'id': account.id,
                'name': account.name,
                'value': account.value,
                'due_date': account.due_date.strftime('%Y-%m-%d'),
                'paid': account.paid
            }
            for account in reminders
        ]
        return jsonify({'reminders': result}), 200
    except SQLAlchemyError as e:
        logger.error("Erro ao buscar lembretes: %s", e)
        return jsonify({'error': 'Erro ao buscar lembretes.', 'details': str(e)}), 500

@api.route('/reminders/<string:account_id>', methods=['GET'])
def get_reminder_details(account_id):
    try:
        account = Account.query.filter_by(id=account_id).first()
        if not account:
            return jsonify({'error': 'Lembrete não encontrado.'}), 404

        result = {
            'id': account.id,
            'name': account.name,
            'value': account.value,
            'due_date': account.due_date.strftime('%Y-%m-%d'),
            'paid': account.paid
        }
        return jsonify(result), 200
    except SQLAlchemyError as e:
        logger.error("Erro ao buscar detalhes do lembrete: %s", e)
        return jsonify({'error': 'Erro ao buscar detalhes do lembrete.', 'details': str(e)}), 500

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Server is running!'}), 200

# Registrar o blueprint e criar tabelas
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

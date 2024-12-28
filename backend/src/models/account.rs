use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, FromRow)]
pub struct Account {
    pub id: Uuid,
    pub name: String,
    pub value: f64,
    pub due_date: DateTime<Utc>,   // Optional DateTime<Utc>
    pub paid: Option<bool>,  // Optional boolean for 'paid'
    pub created_at: Option<DateTime<Utc>>, // Optional DateTime<Utc>
}

#[derive(Serialize, Deserialize)]
pub struct CreateAccountSchema {
    pub name: String,
    pub value: f64, // Ajustado para BigDecimal
    pub due_date: Option<DateTime<Utc>>, // Ajustado para DateTime<Utc>
    pub paid: Option<bool>,
}

#[derive(Deserialize)]
pub struct UpdateAccountSchema {
    pub name: Option<String>,
    pub value: Option<f64>,
    pub due_date: Option<DateTime<Utc>>, // Tipo atualizado
    pub paid: Option<bool>,
}

#[derive(Serialize, Deserialize)]
pub struct FilterOptions {
    pub name: Option<String>,
    pub paid: Option<bool>,
    pub limit: Option<u32>, // Adicionado
    pub page: Option<u32>,  // Adicionado
}
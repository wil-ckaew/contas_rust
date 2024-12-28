use serde::{Deserialize, Serialize};
use uuid::Uuid; // Adicionado para o uso do tipo Uuid


#[derive(Deserialize)]
pub struct CreateAccountSchema {
    pub name: String,
    pub value: f64,
    pub due_date: NaiveDate,
    pub paid: bool,
}


#[derive(Deserialize)]
pub struct UpdateAcoountSchema {
    pub student_id: Option<Uuid>,
    pub filename: Option<String>,
    pub description: Option<String>,

    pub id: Option<Uuid>,
    pub name: Option<String>,
    pub value: Option<f64>,
    pub due_date: Option<NaiveDate>,
    pub paid: Option<bool>,
}


#[derive(Serialize, Deserialize, Debug)]
pub struct FilterOptions {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}

use reqwest::Client;
use serde_json::json;

// Defina a função de previsão antes de utilizá-la
async fn predict_account_payment(valor: f64, due_date: &str) -> Result<String, reqwest::Error> {
    let client = Client::new();
    let res = client
        .post("http://localhost:5000/predict")
        .json(&json!({ "valor": valor, "due_date": due_date }))
        .send()
        .await?;

    let prediction: serde_json::Value = res.json().await?;
    Ok(prediction["prediction"].as_str().unwrap().to_string())
}

use actix_web::{
    get, post, delete, patch, web::{Data, Json, scope, Query, Path, ServiceConfig}, HttpResponse, Responder
};

use crate::{
    models::account::{Account, CreateAccountSchema, UpdateAccountSchema, FilterOptions}, 
    AppState,
};

use chrono::{DateTime, NaiveDateTime, Utc, TimeZone};
use bigdecimal::ToPrimitive;
use sqlx::PgPool;
use uuid::Uuid;

#[post("/accounts")]
async fn create_account(
    body: Json<CreateAccountSchema>,
    data: Data<AppState> 
) -> impl Responder { 
    let query = r#"
    INSERT INTO accounts (name, value, due_date, paid, created_at) 
        VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING id, name, value, due_date, paid, created_at
    "#;
    match sqlx::query_as::<_, Account>(query)
        .bind(&body.name)
        .bind(&body.value)
        .bind(&body.due_date)
        .bind(&body.paid.unwrap_or(false))
        .fetch_one(&data.db)
        .await
    {
        Ok(account) => {
            let response = json!({
                "status": "success",
                "account": {
                    "id": account.id,
                    "name": account.name,
                    "value": account.value.to_string(),
                    "due_date": account.due_date,
                    "created_at": account.created_at
                    
                }
            });
            HttpResponse::Ok().json(response)
        }
        Err(error) => {
            let response = json!({
                "status": "error",
                "message": format!("Failed to create account: {:?}", error)
            });
            HttpResponse::InternalServerError().json(response)
        }
    }
}

#[get("/accounts")]
pub async fn get_all_accounts(
    opts: Query<FilterOptions>,
    data: Data<AppState>
) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    match sqlx::query_as!(
        Account,
        "SELECT * FROM accounts ORDER BY id LIMIT $1 OFFSET $2",
        limit as i32,
        offset as i32
    )
    .fetch_all(&data.db)
    .await
    {
        Ok(accounts) => {
            let response = json!({
                "status": "success",
                "accounts": accounts
            });
            HttpResponse::Ok().json(response)
        }
        Err(error) => {
            let response = json!({
                "status": "error",
                "message": format!("Failed to get accounts: {:?}", error)
            });
            HttpResponse::InternalServerError().json(response)
        }
    }
}

#[get("/accounts/{id}")]
async fn get_account_by_id(
    path: Path<Uuid>,
    data: Data<AppState>
) -> impl Responder {
    let account_id = path.into_inner();

    match sqlx::query_as!(
        Account,
        "SELECT * FROM accounts WHERE id = $1",
        account_id
    )
    .fetch_one(&data.db)
    .await
    {
        Ok(account) => {
            let response = json!({
                "status": "success",
                "account": account
            });
            HttpResponse::Ok().json(response)
        }
        Err(error) => {
            let response = json!({
                "status": "error",
                "message": format!("Failed to get account: {:?}", error)
            });
            HttpResponse::InternalServerError().json(response)
        }
    }
}

#[get("/accounts/{id}/predict_payment")]
async fn predict_payment_for_account(
    path: Path<Uuid>,
    data: Data<AppState>
) -> impl Responder {
    let account_id = path.into_inner();

    // Buscar a conta pelo ID
    match sqlx::query_as!(
        Account,
        "SELECT * FROM accounts WHERE id = $1",
        account_id
    )
    .fetch_one(&data.db)
    .await
    {
        Ok(account) => {
            // Obter a previsão de pagamento
            match predict_account_payment(account.value.to_f64().unwrap(), &account.due_date.to_string()).await {
                Ok(prediction) => {
                    let response = json!({
                        "status": "success",
                        "account_id": account.id,
                        "prediction": prediction
                    });
                    HttpResponse::Ok().json(response)
                }
                Err(error) => {
                    let response = json!({
                        "status": "error",
                        "message": format!("Failed to get payment prediction: {:?}", error)
                    });
                    HttpResponse::InternalServerError().json(response)
                }
            }
        }
        Err(fetch_error) => {
            let response = json!({
                "status": "error",
                "message": format!("Account not found: {:?}", fetch_error)
            });
            HttpResponse::NotFound().json(response)
        }
    }
}

#[patch("/accounts/{id}")]
async fn update_account_by_id(
    path: Path<Uuid>,
    body: Json<UpdateAccountSchema>,
    data: Data<AppState>
) -> impl Responder {
    let account_id = path.into_inner();

    // Buscar a conta
    match sqlx::query_as!(Account, "SELECT * FROM accounts WHERE id = $1", account_id)
        .fetch_one(&data.db)
        .await
    {
        Ok(account) => {
            // If due_date is Some, convert to DateTime<Utc> if necessary
            let due_date = body.due_date.map(|dt| Utc.timestamp(dt.timestamp(), 0));

            // Realizar o update
            let update_result = sqlx::query_as!(
                Account,
                "UPDATE accounts SET 
                    name = COALESCE($1, name), 
                    value = COALESCE($2, value), 
                    due_date = COALESCE($3, due_date), 
                    paid = COALESCE($4, paid)
                WHERE id = $5 
                RETURNING *",
                body.name.as_ref(),
                body.value.as_ref(),
                due_date.as_ref(),  // Pass the Option<DateTime<Utc>> here
                body.paid.unwrap_or(false),
                account_id
            )
            .fetch_one(&data.db)
            .await;

            // Resposta após atualização
            match update_result {
                Ok(updated_account) => {
                    let response = json!({
                        "status": "success",
                        "account": updated_account
                    });
                    HttpResponse::Ok().json(response)
                }
                Err(update_error) => {
                    let response = json!({
                        "status": "error",
                        "message": format!("Failed to update account: {:?}", update_error)
                    });
                    HttpResponse::InternalServerError().json(response)
                }
            }
        }
        Err(fetch_error) => {
            let response = json!({
                "status": "error",
                "message": format!("Account not found: {:?}", fetch_error)
            });
            HttpResponse::NotFound().json(response)
        }
    }
}

#[delete("/accounts/{id}")]
async fn delete_account(
    path: Path<Uuid>,
    data: Data<AppState>
) -> impl Responder {
    let account_id = path.into_inner();

    match sqlx::query!("DELETE FROM accounts WHERE id = $1", account_id)
        .execute(&data.db)
        .await
    {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(err) => {
            let response = json!({
                "status": "error",
                "message": format!("Failed to delete account: {:?}", err)
            });
            HttpResponse::InternalServerError().json(response)
        }
    }
}

pub fn config_account_handler(conf: &mut ServiceConfig) {
    conf.service(get_all_accounts)
        .service(create_account)
        .service(get_account_by_id)
        .service(update_account_by_id)
        .service(delete_account)
        .service(predict_payment_for_account);  // Nova rota para previsão de pagamento
}

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use dotenv::dotenv;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::env;

mod handlers;
mod models;
mod db;

pub struct AppState {
    db: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Servidor iniciado com sucesso!");

    // Configuração de logging
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "actix_web=info");
    }
    dotenv().ok();
    env_logger::init();

    // Obter URL do banco de dados
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL deve ser configurado");

    // Criar conexão com o pool do banco de dados
    let pool = match PgPoolOptions::new().max_connections(10).connect(&database_url).await {
        Ok(pool) => {
            println!("Conexão com o banco de dados estabelecida");
            pool
        }
        Err(error) => {
            eprintln!("Falha ao conectar ao banco de dados: {:?}", error);
            std::process::exit(1);
        }
    };

    // Iniciar o servidor HTTP
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(handlers::config)
            .wrap(Logger::default())
            .wrap(Cors::default()
                .allowed_origin("http://localhost:3000")  // Permite apenas o frontend na porta 3000
                .allow_any_method()  // Permite qualquer método HTTP
                .allow_any_header()  // Permite qualquer cabeçalho
            )

    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

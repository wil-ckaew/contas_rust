// src/handlers/mod.rs

pub mod account_handler;

use actix_web::web::ServiceConfig;

pub fn config(conf: &mut ServiceConfig) {
    conf.service(
        actix_web::web::scope("/api")
            .configure(account_handler::config_account_handler),  // Corrija a referência para usar a função corretamente
    );
}

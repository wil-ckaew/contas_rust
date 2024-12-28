use sqlx::{PgPool, Pool, Postgres};
use std::env;

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> DbPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL not set");
    PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to the database")
}

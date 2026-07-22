// src/modules/mod.rs
use axum::Router;

pub mod render;

pub fn register_modules() -> Router {
    Router::new().nest("/v1", render::router())
}

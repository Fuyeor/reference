// src/modules/render/mod.rs
use axum::{Router, routing::get};

pub mod handlers;

/// Registers domain-specific routing under the /render namespace
pub fn router() -> Router {
    Router::new()
        // /v1/prerender/:locale/:module/*content
        .route(
            "/prerender/:locale/:module/*content",
            get(handlers::handle_prerender),
        )
}

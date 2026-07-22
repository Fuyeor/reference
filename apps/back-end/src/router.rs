// src/router.rs
use crate::modules::register_modules;
use axum::Router;
use tower_http::trace::TraceLayer;

/// Builds the global Axum router, injecting layers and unified controllers
pub fn build_router() -> Router {
    Router::new()
        .merge(register_modules())
        .layer(TraceLayer::new_for_http())
}

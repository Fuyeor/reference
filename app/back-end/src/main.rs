// src/main.rs
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod modules;
mod router;

#[tokio::main]
async fn main() {
    // Initialize
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Build modular router
    let app = router::build_router();

    // Bind port and start listening
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!(
        "🚀 [reference-back] Axum microservice running on {}",
        listener.local_addr().unwrap()
    );

    axum::serve(listener, app).await.unwrap();
}

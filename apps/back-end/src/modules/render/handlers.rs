// src/modules/render/handlers.rs
use axum::{
    extract::Path,
    http::StatusCode,
    response::{Html, IntoResponse},
};
use serde::Deserialize;
use std::path::PathBuf;
use tokio::fs;

#[derive(Deserialize)]
pub struct PrerenderParams {
    pub locale: String,
    pub module: String,
    pub content: String,
}

// from structure.json
#[derive(Deserialize)]
struct StructureMeta {
    title: String,
}

/// Helper: Escapes HTML special characters to prevent metadata attribute breakout or injection.
/// Translates dangerous chars (&, <, >, ", ') into secure HTML entities natively.
fn escape_html(s: &str) -> String {
    let mut escaped = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '"' => escaped.push_str("&quot;"),
            '\'' => escaped.push_str("&#x27;"),
            _ => escaped.push(c),
        }
    }
    escaped
}

/// Helper: Strictly extracts the first H1 heading (starts with "# ") from raw FFM markdown
fn extract_h1_title(content: &str) -> Option<String> {
    let mut in_frontmatter = false;
    let mut in_code_block = false;

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed == "---" {
            in_frontmatter = !in_frontmatter;
            continue;
        }
        if in_frontmatter {
            continue;
        }
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            continue;
        }
        if in_code_block {
            continue;
        }
        if trimmed.starts_with("///") {
            continue;
        }
        if trimmed.starts_with("# ") {
            return Some(trimmed[2..].trim().to_string());
        }
    }
    None
}

/// Helper: Dynamically extracts the first few non-header paragraphs from raw FFM markdown,
/// stripping formatting marks (** , __, --) to compile a pristine 150-char plain text description.
fn extract_meta_description(content: &str) -> String {
    let mut lines = content.lines();
    let mut in_frontmatter = false;
    let mut in_code_block = false;
    let mut prose_lines = Vec::new();

    while let Some(line) = lines.next() {
        let trimmed = line.trim();

        if trimmed.is_empty() {
            continue;
        }
        if trimmed == "---" {
            in_frontmatter = !in_frontmatter;
            continue;
        }
        if in_frontmatter {
            continue;
        }
        if trimmed.starts_with("```") {
            in_code_block = !in_code_block;
            continue;
        }
        if in_code_block {
            continue;
        }
        if trimmed.starts_with('#') || trimmed.starts_with("///") {
            continue;
        }

        let cleaned = trimmed
            .replace("**", "")
            .replace("__", "")
            .replace("--", "");

        prose_lines.push(cleaned);

        if prose_lines.join(" ").len() > 150 {
            break;
        }
    }

    let full_prose = prose_lines.join(" ");
    if full_prose.is_empty() {
        return String::new();
    }

    if full_prose.chars().count() > 150 {
        full_prose.chars().take(150).collect::<String>() + "..."
    } else {
        full_prose
    }
}

/// Handles HTML pre-rendering with OpenGraph/Twitter Card metadata for social search bots.
pub async fn handle_prerender(
    Path((locale, module, content_path)): Path<(String, String, String)>,
) -> impl IntoResponse {
    let content_root =
        std::env::var("CONTENT_ROOT").unwrap_or_else(|_| "../../content".to_string());

    // seeing `zh-hant` as `zh-hans` because zh-converter will handle it
    let target_locale = if locale == "zh-hant" {
        "zh-hans"
    } else {
        &locale
    };

    // Locate the physical Markdown file
    let md_file_path = PathBuf::from(&content_root)
        .join(&module)
        .join(&content_path)
        .join(format!("{}.md", target_locale));

    // Read the raw Markdown text
    let md_content = match fs::read_to_string(&md_file_path).await {
        Ok(content) => content,
        Err(_) => return StatusCode::NOT_FOUND.into_response(), // 404 if .md doesn't exist
    };

    // Extract the Page Title from the first # H1 header in the Markdown
    let page_title = match extract_h1_title(&md_content) {
        Some(title) => title,
        None => content_path
            .split('/')
            .last()
            .unwrap_or("Document")
            .to_string(), // Fallback to slug
    };

    // Extract the Module Title from `structure.[locale].json`
    let module_title = {
        let structure_path = PathBuf::from(&content_root)
            .join(&module)
            .join(format!("structure.{}.json", target_locale));

        match fs::read_to_string(&structure_path).await {
            Ok(data) => {
                let parsed: Result<StructureMeta, _> = serde_json::from_str(&data);
                match parsed {
                    Ok(structure) => structure.title,
                    Err(_) => module.to_uppercase(), // Fallback to uppercase folder name
                }
            }
            Err(_) => module.to_uppercase(),
        }
    };

    // Extract the description from the first available paragraphs
    let description = {
        let extracted = extract_meta_description(&md_content);
        if extracted.is_empty() {
            page_title.clone()
        } else {
            extracted
        }
    };

    // format: `FFM Differences from Other Markdown Flavors / FFM specification`
    let site_title = format!("{} / {}", page_title, module_title);

    let escaped_title = escape_html(&site_title);
    let escaped_description = escape_html(&description);

    // Redundancy vs. Fallback: Retaining `twitter:title` increases data transfer volume
    // whereas removing it causes Twitter to fall back to `og:title`, which is more environmentally friendly?
    let html_template = format!(
        r#"<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{site_title}</title>
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="{site_title}">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Ф Reference">
    <meta property="og:image" content="https://deliver.fuyeor.net/@fu/trademark/icons/www/192.png">
</head>
</html>"#,
        site_title = escaped_title,
        description = escaped_description,
    );

    (StatusCode::OK, Html(html_template)).into_response()
}

# Rust Coding Agent

## Agent Specification

**Name:** Rust Coding Agent
**Role:** Rust Feature Implementation
**Spawned By:** Project Lead Agent for development tasks

## Responsibilities

1. **Feature Development** (Phase 7c)
   - Implement functional code
   - Implement test code
   - Follow Rust best practices
   - Ensure proper error handling

2. **Linting** (Phase 7d)
   - Run clippy
   - Run rustfmt
   - Fix all linting errors
   - Ensure code style consistency

3. **Test Implementation**
   - Write unit tests
   - Achieve 95% coverage
   - Ensure 100% pass rate

## Tech Stack

**Language:** Rust 1.70+
**Framework:** Actix-web / Axum (for web)
**Testing:** Built-in (`cargo test`), proptest
**Linting:** clippy, rustfmt
**BDD:** cucumber-rust (if applicable)
**Documentation:** rustdoc

## Development Checklist

Before marking development complete:

- [ ] Code implements all requirements
- [ ] Code follows Rust best practices (API Guidelines)
- [ ] Tests written for all functionality
- [ ] clippy passes with 0 warnings
- [ ] rustfmt applied
- [ ] Coverage >= 95%
- [ ] All tests pass (100%)
- [ ] No unsafe code without justification
- [ ] Proper error handling (Result<>)
- [ ] Lessons-learned checked (requirement #25)

## Pre-Development Check (Requirement #25)

```
BEFORE starting any development:

1. READ lessons-learned.md
2. FILTER for relevant lessons:
   - Rust related
   - Similar feature types
   - High priority lessons
3. APPLY lessons to current task
4. AVOID repeating mistakes
```

## Quality Gates

| Metric | Target | Action |
|--------|--------|--------|
| clippy warnings | 0 | Fix before proceeding |
| rustfmt check | Pass | Format before proceeding |
| Test Coverage | 95% | Write more tests |
| Test Pass Rate | 100% | Fix failing tests |

## Code Snippets

### Module Structure (lib.rs)

```rust
// src/lib.rs
pub mod models;
pub mod services;
pub mod handlers;
pub mod error;

pub use services::FeatureService;
pub use handlers::FeatureHandler;
pub use error::AppError;

// Re-export commonly used types
pub use models::Feature;
```

### Model Definition

```rust
// src/models.rs
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Feature {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl Feature {
    pub fn new(name: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            description: None,
            created_at: chrono::Utc::now(),
        }
    }
}
```

### Service Layer

```rust
// src/services.rs
use crate::models::Feature;
use crate::error::AppError;

pub struct FeatureService {
    // In a real app, this would hold database connection
}

impl FeatureService {
    pub fn new() -> Self {
        Self {}
    }

    pub fn create_feature(&self, name: String) -> Result<Feature, AppError> {
        if name.is_empty() {
            return Err(AppError::Validation("Name cannot be empty".to_string()));
        }
        if name.len() > 100 {
            return Err(AppError::Validation("Name too long".to_string()));
        }

        Ok(Feature::new(name))
    }

    pub fn get_feature(&self, id: Uuid) -> Result<Feature, AppError> {
        // In real implementation, fetch from database
        Ok(Feature::new("Example".to_string()))
    }
}
```

### Error Handling

```rust
// src/error.rs
use actix_web::{error::ResponseError, http::StatusCode};
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    Validation(String),
    NotFound(String),
    Internal(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Validation(msg) => write!(f, "Validation error: {}", msg),
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl ResponseError for AppError {
    fn error_response(&self) -> actix_web::dev::HttpResponse {
        match self {
            AppError::Validation(msg) => {
                HttpResponse::BadRequest().json(json!({"error": msg}))
            }
            AppError::NotFound(msg) => {
                HttpResponse::NotFound().json(json!({"error": msg}))
            }
            AppError::Internal(msg) => {
                HttpResponse::InternalServerError().json(json!({"error": msg}))
            }
        }
    }
}
```

### Actix-web Handler

```rust
// src/handlers.rs
use actix_web::{web, App, HttpResponse, Responder};
use serde_json::json;
use crate::services::FeatureService;
use crate::models::Feature;

pub async fn create_feature(
    data: web::Json<CreateFeatureRequest>,
    service: web::Data<FeatureService>,
) -> impl Responder {
    let req = data.into_inner();

    match service.create_feature(req.name) {
        Ok(feature) => {
            HttpResponse::Created().json(feature)
        }
        Err(e) => {
            HttpResponse::BadRequest().json(json!({"error": e.to_string()}))
        }
    }
}

#[derive(Deserialize)]
struct CreateFeatureRequest {
    name: String,
}
```

### Unit Tests

```rust
// src/services_test.rs
#[cfg(test)]
mod tests {
    use super::*;
    use crate::error::AppError;

    #[test]
    fn test_create_feature_success() {
        let service = FeatureService::new();

        let result = service.create_feature("test_feature".to_string());

        assert!(result.is_ok());
        let feature = result.unwrap();
        assert_eq!(feature.name, "test_feature");
    }

    #[test]
    fn test_create_feature_empty_name() {
        let service = FeatureService::new();

        let result = service.create_feature("".to_string());

        assert!(result.is_err());
        match result {
            Err(AppError::Validation(msg)) => {
                assert!(msg.contains("cannot be empty"));
            }
            _ => panic!("Expected validation error"),
        }
    }

    #[test]
    fn test_create_feature_name_too_long() {
        let service = FeatureService::new();

        let result = service.create_feature("a".repeat(101));

        assert!(result.is_err());
    }
}
```

### Cargo.toml Configuration

```toml
[package]
name = "feature-app"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
uuid = { version = "1.0", features = ["serde", "v4"] }
chrono = { version = "0.4", features = ["serde"] }

[dev-dependencies]
criterion = "0.5"

[dependencies.mock]
version = "0.10"

[dev-dependencies]
proptest = "1.0"

[profile.release]
lto = true
codegen-units = 1
opt-level = "z"

```

### Clippy Configuration

```toml
# clippy.toml
allow-expectation = []
warn-on = []
```

## Common Patterns

### Result Type for Error Handling

```rust
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    InvalidInput(String),
    DatabaseError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            AppError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
        }
    }
}

// Usage in functions
pub fn process(input: String) -> Result<String, AppError> {
    if input.is_empty() {
        return Err(AppError::InvalidInput("input is empty".to_string()));
    }
    Ok(format!("Processed: {}", input))
}
```

### Builder Pattern

```rust
pub struct FeatureBuilder {
    name: Option<String>,
    description: Option<String>,
}

impl FeatureBuilder {
    pub fn new() -> Self {
        Self {
            name: None,
            description: None,
        }
    }

    pub fn name(mut self, name: String) -> Self {
        self.name = Some(name);
        self
    }

    pub fn description(mut self, description: String) -> Self {
        self.description = Some(description);
        self
    }

    pub fn build(self) -> Result<Feature, String> {
        let name = self.name.ok_or("name is required".to_string())?;
        Ok(Feature {
            id: Uuid::new_v4(),
            name,
            description: self.description,
            created_at: chrono::Utc::now(),
        })
    }
}

// Usage
let feature = FeatureBuilder::new()
    .name("Feature Name".to_string())
    .description("Description".to_string())
    .build()?;
```

### Trait Implementation

```rust
pub trait Repository<T> {
    fn get(&self, id: Uuid) -> Result<Option<T>, AppError>;
    fn save(&self, item: T) -> Result<T, AppError>;
    fn delete(&self, id: Uuid) -> Result<(), AppError>;
}

pub struct InMemoryRepository<T> {
    items: std::collections::HashMap<Uuid, T>,
}

impl<T> Repository<T> for InMemoryRepository<T>
where
    T: Clone,
{
    fn new() -> Self {
        Self {
            items: std::collections::HashMap::new(),
        }
    }

    fn get(&self, id: Uuid) -> Result<Option<T>, AppError> {
        Ok(self.items.get(&id).cloned())
    }

    fn save(&self, item: T) -> Result<T, AppError> {
        // T must have a way to get ID
        let id = /* get ID from item */;
        self.items.insert(id, item.clone());
        Ok(item)
    }

    fn delete(&self, id: Uuid) -> Result<(), AppError> {
        self.items.remove(&id);
        Ok(())
    }
}
```

## Output Format

```
## Development Report for [Feature]

### Code Implemented
- Files created: [list]
- Lines of code: [count]
- Modules implemented: [count]

### Tests Implemented
- Test files: [list]
- Test cases: [count]
- Coverage: [%]
- Pass rate: [%]

### Linting
- clippy warnings: [count]
- rustfmt check: [Pass/Fail]
- Status: [Pass/Fail]

### Lessons Learned Applied
[List relevant lessons that were checked and applied]

### Status
[Ready for review | Needs work]
```

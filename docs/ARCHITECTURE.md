# Project Architecture

## Overview
FoodBot Africa is an Angular application built using **Standalone Components**, removing the need for `NgModule`. The application focuses on delivering AI-powered nutrition advice suited for African diets.

## Tech Stack
- **Framework**: Angular (Latest)
- **Styling**: Tailwind CSS
- **Routing**: Angular Router (configured in `main.ts`)
- **State/Auth**: `AuthService` (Observable-based state)

## Directory Structure
The project follows a feature-based modular structure within the `src` directory:

```
src/
├── components/         # specialized directories for each component
│   ├── [component]/    # e.g., home, chat, nutrition
│   │   ├── [name].ts   # Logic (Standalone Component)
│   │   ├── [name].html # Template
│   │   └── [name].css  # Styles
├── guards/             # Route guards (e.g., AuthGuard)
├── services/           # Shared services (e.g., AuthService)
└── main.ts             # Application entry point & Routing config
```

## Key Architectural Decisions

### Standalone Components
All components are marked as `standalone: true`. This simplifies the dependency graph and allows for direct imports.
- **Imports**: CommonModule, RouterLink, and other features are imported directly in the `@Component` decorator.

### Authentication Flow
- **Service**: `AuthService` manages the user session.
- **Guard**: `authGuard` protects sensitive routes (`/chat`, `/planner`, `/profile`, `/nutritionist`).
- **State**: The app uses reactive streams (`authState$`) to react to login/logout events dynamically.

### Routing
Routing is handled centrally in `main.ts`. Routes are lazy-loaded by default nature of imports, though explicit lazy loading syntax isn't currently used, the structure supports it.

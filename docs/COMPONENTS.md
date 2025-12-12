# Component Library

This document outlines the core components of the FoodBot application.

## Core Features

### 1. AI Nutritionist (`/nutritionist`)
- **Path**: `src/components/nutrition/`
- **Purpose**: A specialized chat interface for nutritional advice.
- **Key Features**:
  - Pre-defined "Quick Questions" for African superfoods (Moringa, Teff, etc.).
  - Detailed, structured responses for specific keywords.
  - Simulated typing delays for a natural feel.

### 2. Meal Planner (`/planner`)
- **Path**: `src/components/planner/`
- **Purpose**: Generates personalized meal plans based on user input.
- **Form Inputs**: Duration (3-7 days), Diet Style (Balanced, Vegan, etc.), Budget.
- **Output**: A day-by-day breakdown of breakfast, lunch, and dinner with "Chef's Tips".
- **Logic**: Uses a predefined dictionary of meal templates (`coreMealData`) to generate plans dynamically.

### 3. FoodBot Chat (`/chat`)
- **Path**: `src/components/chat/`
- **Purpose**: General purpose food assistant.
- **Difference from Nutritionist**: More casual, broader scope (recipes, street food info), while Nutritionist is focused on health/science.

## Support Components

### Authentication
- **Login (`/login`)**: Handles user sign-in.
- **Signup (`/signup`)**: New user registration.
- **Profile (`/profile`)**: Displays user details and account settings.

### Informational
- **Home**: Landing page.
- **About**: Company mission.
- **Pricing**: Subscription tiers.
- **Blog & BlogDetail**: Articles and news.

### Legal
- **Privacy Policy**
- **Terms of Service**
- **Cookie Policy**

## Component Patterns
All components follow a strict Separation of Concerns (SoC) pattern:
- **HTML**: Pure template logic, structural directives (`*ngIf`, `*ngFor`).
- **CSS**: Scoped styles (encapsulated by Angular).
- **TS**: Business logic, simulation data, and event handling.

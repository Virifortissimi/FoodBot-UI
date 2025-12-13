# FoodBot UI 🥗🤖

FoodBot is an intelligent nutrition and meal planning application designed to help users manage their dietary goals with the power of AI. Built with structured Angular 18+ and styled with modern Tailwind CSS, it offers a seamless experience for tracking nutrition, planning meals, and getting real-time advice via an AI assistant.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Angular](https://img.shields.io/badge/Angular-18%2B-DD0031.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E.svg)

## 🌟 Features

- **🤖 AI Chat Assistant**: Get personalized nutrition advice and answers to your food queries.
- **📅 Meal Planner**: Organize your daily and weekly meals with an intuitive drag-and-drop interface.
- **🍎 Nutrition Tracker**: Monitor macro and micronutrients to stay on top of your health goals.
- **📝 Blog**: Read articles on health, wellness, and recipes.
- **🔐 Secure Authentication**: Powered by Supabase for reliable user management (Login/Signup).
- **📱 Responsive Design**: tailored for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: [Angular](https://angular.io/) (Latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/) / FontAwesome (implied)

## 📂 Project Structure

```bash
src/
├── components/       # Feature-based components (Chat, Planner, Nutrition, etc.)
├── services/         # Angular services for API/State management
├── guards/           # Route guards (Auth protection)
├── global_styles.css # Global Tailwind imports and custom styles
└── main.ts           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.13.0 or higher
- **npm**: v8.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodbot-ui.git
   cd FoodBot-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory (or check `src/environments`) and add your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

### Development Server

Run a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```bash
npm start
# or
ng serve
```

### Build

Build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
# or
ng build
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.

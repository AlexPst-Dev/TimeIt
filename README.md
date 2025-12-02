# TimeIt ⏱️

**TimeIt** is a modern, dynamic interval timer application designed for sports circuits and high-intensity interval training (HIIT). Built with performance and aesthetics in mind, it allows athletes to configure custom workout routines with ease.

## 🚀 Features

- **Customizable Intervals**: Set the number of rounds, exercises, work duration, and rest periods.
- **Dynamic Timer**: Visual countdown with distinct phases (Work, Rest, Round Rest).
- **Modern UI**: Clean, responsive interface with smooth animations and dark mode support.
- **Focus Mode**: Minimalist display during the workout to keep you focused on the effort.

## 🛠️ Tech Stack

This project is built with the latest web technologies:

- **[Next.js 15](https://nextjs.org/)**: The React Framework for the Web.
- **[TypeScript](https://www.typescriptlang.org/)**: For type-safe code and better developer experience.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: For utility-first, dynamic styling.
- **[Shadcn UI](https://ui.shadcn.com/)**: For beautifully designed, reusable components.

## 🤖 Built with Google Antigravity IDE

This entire application was architected and coded using **Google Antigravity IDE**, an advanced AI-powered development environment that streamlines the coding process from conception to deployment.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── globals.css       # Global styles and Tailwind configuration
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application view
├── components/           # React components
│   ├── ui/               # Shadcn UI primitives (Button, Card, Input, etc.)
│   ├── timer-config-form.tsx  # Configuration form component
│   └── timer-display.tsx      # Active timer display component
├── hooks/                # Custom React hooks
│   └── use-interval-timer.ts  # Core timer logic and state machine
└── lib/                  # Utility functions
    └── utils.ts          # Class merging utilities
```

## 🏁 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AlexPst-Dev/TimeIt.git
    cd TimeIt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
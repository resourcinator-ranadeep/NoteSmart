# 🎓 NoteSmart

> **A premium, high-fidelity classroom management interface inspired by Google Classroom.**

NoteSmart is a modern, responsive educational portal designed for seamless interaction between teachers and students. Built with a focus on aesthetics and performance, it provides a powerful platform for sharing study materials, managing assignments, and facilitating communication.

---

## ✨ Key Features

- 🎛️ **Service-Oriented Architecture**: Clean separation of concerns with a centralized service layer.
- 🔄 **Dynamic Class Switching**: Effortlessly navigate between different subjects and classes.
- 📚 **Study Library**: A professional file management system for uploading and organizing materials.
- 💬 **Gemini AI Assistant**: Integrated AI to help students understand complex topics within the reader.
- 🎨 **Premium UI/UX**: Powered by **Framer Motion** for smooth transitions and a high-end feel.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) (with TypeScript)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Firestore, Storage, Auth)
- **AI Integration**: [Google Gemini Pro/Flash](https://ai.google.dev/)

---

## 🏗️ Project Architecture

The application follows a modular and scalable design:

- **UI Components**: Atomic and reusable components located in `src/components/`.
- **State Management**: Centralized logic in `src/context/ClassroomContext.tsx`.
- **Service Layer**: abstraction for external APIs and Firebase in `src/lib/`.
- **Typing**: Strict type safety ensures reliability throughout the codebase.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/resourcinator-ranadeep/NoteSmart.git
   cd NoteSmart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate it with your credentials (use `.env.example` as a reference):
   ```bash
   cp .env.example .env
   ```

### Running Locally

```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🔒 Security Note

Sensitive credentials (API keys, Firebase configs) should **never** be committed to version control. Ensure your `.env` file is listed in `.gitignore`.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use and adapt it for your own educational platforms!

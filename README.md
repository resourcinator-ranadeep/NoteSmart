# NoteSmart - Frontend (Classroom Expansion)

A premium, high-fidelity classroom management interface inspired by Google Classroom, built with React, Vite, Tailwind CSS, and Framer Motion.

## 🔥 Firebase Quick-Start

This project is optimized for **Firebase (Firestore & Storage)**. To connect your frontend to Firebase:

1.  **Initialize Project**: Create a new project in your [Firebase Console](https://console.firebase.google.com/).
2.  **Add Web App**: Register a web app and copy the `firebaseConfig` object.
3.  **Install SDK**:
    ```bash
    npm install firebase
    ```
4.  **Configure Environment**: Add your Firebase credentials to `.env` (use `.env.example` as a template).
5.  **Enable Services**:
    *   Open `src/lib/firebase.ts` and uncomment the code.
    *   Open `src/context/ClassroomContext.tsx`, uncomment the Firebase stubs, and remove the mock logic.
6.  **Firestore Rules**: Ensure your Firestore and Storage rules allow read/write access (for development).

## 🚀 Backend Architecture

The project follows a **Service-Oriented Design**:
- **UI Components**: Purely visual, they call methods from the Context.
- **Provider (`ClassroomContext.tsx`)**: The single source of truth. All Firebase/API logic lives here.
- **Mock Data**: Located in `src/data/mockData.ts` for instant preview.

## ✨ Features

- **Store/Service Architecture**: Centralized state management makes it easy to maintain and scale.
- **Class Switcher**: Dynamic class switching with persistent state.
- **Google Classroom UI**:
  - **Stream**: Announcements and social updates.
  - **Classwork**: Professional file management and upload system.
  - **People**: Detailed view of teachers and students.
- **Smooth Animations**: Powered by Framer Motion for a premium user experience.
- **Responsive Design**: Fully functional on desktop and tablet.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/resourcinator-ranadeep/NoteSmart.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

### Running the Project

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

- `src/context/`: Contains `ClassroomContext.tsx` (The core data/service layer).
- `src/components/`: Modular UI components.
- `src/types.ts`: Global TypeScript interfaces for the entire project.
- `src/data/`: Centralized mock initial state.

## 📄 License

MIT License - feel free to use this for your own projects!

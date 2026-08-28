# 💬 Real-Time Chat Application

A modern, responsive, real-time chat application that enables seamless communication with instant messaging, secure user authentication, online presence tracking, and image sharing.

Built using **React.js** for the frontend, **Firebase** for authentication and the real-time database, and **Supabase** for media storage.

🌐 **Live Demo:** [https://chat-app-d042d.web.app/](https://chat-app-d042d.web.app/)

---

## ✨ Features

- 🔴 **Real-Time Messaging:** Instantly send and receive messages with live updates.
- 🔐 **Secure Authentication:** User sign-up, sign-in, and session persistence powered by Firebase Authentication.
- 🟢 **Presence Tracking:** Shows online/offline indicators for users with automated heartbeat sync.
- 🖼️ **Image/Media Sharing:** Upload and share screenshots/images directly in conversations via Supabase Storage integration.
- 👤 **Profile Customization:** Update user display name, profile avatar, and custom biography status.
- 💬 **Direct Messaging:** Search for registered users by their username and initiate a direct 1-to-1 chat session.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v19)** - Declarative component-based UI.
- **Vite (v7)** - Fast, modern build tool and development server.
- **Vanilla CSS** - Modular layout styles.
- **React Router DOM (v7)** - Client-side routing.
- **React Toastify** - Interactive alert and success notifications.

### Backend & Services
- **Firebase Authentication** - Handles secure sign-in and registration.
- **Firebase Firestore** - NoSQL real-time document database for message logs and user details.
- **Supabase Storage** - High-performance storage buckets for chat images and user avatars.

---

## 📂 Project Structure

The project is structured with a deployment root directory and a nested React app subdirectory:

```
chat-app/                         # Root Workspace Directory
├── .firebaserc                   # Firebase configuration (defines default project alias)
├── firebase.json                 # Firebase Hosting rules (serves build directory)
├── README.md                     # Main documentation (This file)
├── GEMINI.md                     # AI coding agent context rules
└── chat-app/                     # React Frontend Subdirectory
    ├── package.json              # Script triggers and packages dependencies
    ├── vite.config.js            # Vite configurations
    ├── index.html                # Entry HTML template
    └── src/                      # App Source Code
        ├── main.jsx              # React mounting root
        ├── App.jsx               # Navigation router and auth state handlers
        ├── assets/               # Image/icon design assets
        ├── components/           # Component layouts (ChatBox, LeftSidebar, RightSidebar)
        ├── config/               # API clients initializations (firebase.js, supabase.js)
        ├── context/              # Global state provider (AppContext.jsx)
        ├── lib/                  # Library utilities (Supabase media upload function)
        └── pages/                # Pages view (Chat dashboard, Login forms, Profile update)
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed on your machine.

---

### ⚙️ Step-by-Step Setup

#### 1. Clone & Navigate
Navigate to the project directory:
```bash
cd chat-app
```

#### 2. Install Dependencies
Navigate into the frontend subdirectory and install node packages:
```bash
cd chat-app
npm install
```

#### 3. Setup Firebase
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** provider in **Authentication**.
3. Create a **Cloud Firestore Database** (start in production or test mode).
4. Register a Web App in Firebase and copy the `firebaseConfig` object credentials.
5. Paste your config credentials into the React code at:
   👉 [`chat-app/src/config/firebase.js`](file:///c:/Users/STAR%20Zx/Desktop/project/chat-app/chat-app/src/config/firebase.js)

#### 4. Setup Supabase
1. Create a project in the [Supabase Dashboard](https://supabase.com/).
2. Navigate to **Storage** and create a new public bucket named **`chat-images`**.
3. Copy your **Supabase URL** and **Anon API Key** from the Project API settings.
4. Update the initialization credentials in:
   👉 [`chat-app/src/config/supabase.js`](file:///c:/Users/STAR%20Zx/Desktop/project/chat-app/chat-app/src/config/supabase.js)

---

### 💻 Running the App Locally

Start the Vite development server by executing inside the `chat-app/` subdirectory:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

### 📦 Build & Deployment

To build the static application bundle:
```bash
npm run build
```
This generates the optimized production bundle inside the `chat-app/chat-app/dist` directory.

To deploy the application to Firebase Hosting, run from the root directory:
```bash
firebase deploy
```

---

## 🎯 Future Roadmap

- 👥 **Group Chats:** Create rooms and chat with multiple users simultaneously.
- 📞 **Voice & Video calls:** Seamless audio/video communications using WebRTC.
- ☑️ **Message Read Receipts:** Visual cues for delivered and read states (`double tick`).
- 😀 **Emoji Picker:** Rich keyboard integrations for stickers and reaction support.
- 🔐 **End-to-End Encryption:** Encrypted text delivery using secure hashing.

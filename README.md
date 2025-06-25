# 🚀 LIA AI Chat Application

A modern, real-time chat application built for collaborative teams. This project demonstrates scalable frontend-backend architecture, real-time communication, and a polished user experience.

## 📝 Project Summary
This application enables authenticated users to join a group chat, see who is online, and exchange messages in real time. It is designed for extensibility, maintainability, and a modern, professional look and feel.

## ✨ Features
- 🔐 User authentication (username & password, with avatar selection)
- 💬 Real-time group chat with online user presence
- 🕒 Persistent chat history (in-memory for demo; easily extendable to database)
- 📱 Responsive, accessible, and visually appealing UI (Tailwind CSS)
- 🔄 Session persistence (auto-login)
- ✍️ Typing indicators

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO

## ⚡ Setup & Running Locally

### Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install Dependencies
#### Frontend:
```bash
npm install
```
#### Backend:
```bash
cd server
npm install
cd ..
```

### 3. Start the Application
#### Backend:
```bash
cd server
npm run dev
# or
node server.js
```
#### Frontend (in a new terminal):
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)

## 🚦 Usage
- 📝 Register or log in with a unique username and password.
- 😃 Choose an avatar and join the chat room.
- 💬 Send and receive messages in real time.
- 👀 See who is online and who is typing.
- 🕒 Your session and chat history persist until logout or server restart.

## 🏗️ Extensibility & Company Value
- 🧩 The codebase is modular and ready for features like private messaging, file sharing, or integration with company authentication systems.
- 🎨 UI and backend are easily themeable and scalable for enterprise use.
- 📈 Demonstrates best practices in React, Node.js, and real-time app design.

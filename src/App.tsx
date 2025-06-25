import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import LoginForm from './components/LoginForm';
import { io, Socket } from 'socket.io-client';

export interface User {
  id?: string; // id is only for online users
  username: string;
  avatar: string;
  joinedAt?: Date;
  status: 'online' | 'offline';
}

export interface Message {
  id: number;
  text: string;
  user: User;
  timestamp: Date;
  type: 'message' | 'system';
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { withCredentials: true });

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Try auto-login if session exists
      const sessionToken = localStorage.getItem('sessionToken');
      const username = localStorage.getItem('username');
      if (sessionToken && username) {
        newSocket.emit('session_login', { sessionToken, username });
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('set_cookie', ({ sessionToken, username }) => {
      localStorage.setItem('sessionToken', sessionToken);
      localStorage.setItem('username', username);
      setLoginError(null);
    });
    newSocket.on('login_error', (data) => {
      setLoginError(data.message);
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('username');
      setCurrentUser(null);
      setMessages([]);
    });

    // On successful session login, set currentUser and messages
    newSocket.on('chat_history', (history) => {
      setMessages(history);
      // If not logged in, but session is valid, set currentUser
      if (!currentUser) {
        const username = localStorage.getItem('username');
        if (username) {
          // Avatar is not in localStorage, so get from server (set_cookie or users_update)
          // We'll set it in set_cookie or users_update event
        }
      }
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  // Listen for users_update to set currentUser's avatar after session login and update users
  useEffect(() => {
    if (!socket) return;
    const handler = (usersList: User[]) => {
      setUsers(usersList);
      const username = localStorage.getItem('username');
      if (username && !currentUser) {
        const user = usersList.find((u: User) => u.username === username);
        if (user) setCurrentUser(user);
      }
    };
    socket.on('users_update', handler);
    return () => { socket.off('users_update', handler); };
  }, [socket, currentUser]);

  const handleLogin = (userData: { username: string; password: string; avatar: string }) => {
    if (socket) {
      socket.emit('user_login', userData);
      // currentUser will be set on users_update after login
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.emit('user_logout'); // Notify server of explicit logout
      socket.disconnect();
      socket.connect();
    }
    setCurrentUser(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} isConnected={isConnected} loginError={loginError} />;
  }

  return (
    <ChatInterface 
      socket={socket} 
      currentUser={currentUser} 
      onLogout={handleLogout}
      isConnected={isConnected}
      messages={messages}
      setMessages={setMessages}
      users={users}
      setUsers={setUsers}
    />
  );
}

export default App;
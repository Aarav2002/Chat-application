import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const chatData = {
  messages: [], 
  users: new Map(),
  typingUsers: new Set(),
  userCredentials: new Map(),
  sessions: new Map(), 
};


const allUsers = new Map();
const pendingDisconnects = new Map(); 


function generateSessionToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  
  socket.on('user_login', (userData) => {
    
    if (pendingDisconnects.has(socket.id)) {
      clearTimeout(pendingDisconnects.get(socket.id));
      pendingDisconnects.delete(socket.id);
    }
    const { username, password, avatar } = userData;
    let userCred = chatData.userCredentials.get(username);
    let isNewUser = false;

    
    if (!userCred) {
      chatData.userCredentials.set(username, { password, avatar });
      isNewUser = true;
    } else {
      
      if (userCred.password !== password) {
        socket.emit('login_error', { message: 'Invalid password.' });
        return;
      }
    }

   
    const sessionToken = generateSessionToken();
    chatData.sessions.set(sessionToken, username);
    const user = {
      id: socket.id,
      username,
      avatar: userCred ? userCred.avatar : avatar,
      joinedAt: new Date(),
      sessionToken
    };
    chatData.users.set(socket.id, user);

  
    socket.emit('set_cookie', { sessionToken, username });

    
    socket.emit('chat_history', chatData.messages);

    
    if (isNewUser) {
      socket.broadcast.emit('user_joined', user);
    }

    
    allUsers.set(username, {
      username,
      avatar: userCred ? userCred.avatar : avatar,
      status: 'online'
    });

   
    io.emit('users_update', Array.from(allUsers.values()));

    console.log(`User ${username} logged in (${isNewUser ? 'registered' : 'logged in'})`);
  });

  
  socket.on('session_login', ({ sessionToken, username }) => {
    
    if (pendingDisconnects.has(socket.id)) {
      clearTimeout(pendingDisconnects.get(socket.id));
      pendingDisconnects.delete(socket.id);
    }
    const storedUsername = chatData.sessions.get(sessionToken);
    const userCred = chatData.userCredentials.get(username);
    if (storedUsername === username && userCred) {
      const user = {
        id: socket.id,
        username,
        avatar: userCred.avatar,
        joinedAt: new Date(),
        sessionToken
      };
      chatData.users.set(socket.id, user);
      
      allUsers.set(username, {
        username,
        avatar: userCred.avatar,
        status: 'online'
      });
      socket.emit('chat_history', chatData.messages);
      io.emit('users_update', Array.from(allUsers.values()));
      socket.emit('set_cookie', { sessionToken, username });
      console.log(`User ${username} auto-logged in with session.`);
    } else {
      socket.emit('login_error', { message: 'Session invalid. Please log in again.' });
    }
  });

  
  socket.on('send_message', (messageData) => {
    const user = chatData.users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      text: messageData.text,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      },
      timestamp: new Date(),
      type: 'message'
    };

   
    chatData.messages.push(message);
  
    if (chatData.messages.length > 100) {
      chatData.messages = chatData.messages.slice(-100);
    }


    io.emit('new_message', message);
  });

  
  socket.on('typing_start', () => {
    const user = chatData.users.get(socket.id);
    if (!user) return;

    chatData.typingUsers.add(socket.id);
    socket.broadcast.emit('user_typing', {
      userId: socket.id,
      username: user.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', () => {
    const user = chatData.users.get(socket.id);
    if (!user) return;

    chatData.typingUsers.delete(socket.id);
    socket.broadcast.emit('user_typing', {
      userId: socket.id,
      username: user.username,
      isTyping: false
    });
  });

  
  socket.on('user_logout', () => {
    const user = chatData.users.get(socket.id);
    if (user) {
      chatData.users.delete(socket.id);
      chatData.typingUsers.delete(socket.id);
      
      if (allUsers.has(user.username)) {
        allUsers.set(user.username, {
          ...allUsers.get(user.username),
          status: 'offline'
        });
      }
     
      socket.broadcast.emit('user_left', user);
      
      io.emit('users_update', Array.from(allUsers.values()));
      console.log(`User ${user.username} left the chat (logout)`);
    }
  });

 
  socket.on('disconnect', () => {
    const user = chatData.users.get(socket.id);
    if (user) {
      chatData.users.delete(socket.id);
      chatData.typingUsers.delete(socket.id);
      
      if (allUsers.has(user.username)) {
        allUsers.set(user.username, {
          ...allUsers.get(user.username),
          status: 'offline'
        });
      }
      
      io.emit('users_update', Array.from(allUsers.values()));
      console.log(`User ${user.username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
});


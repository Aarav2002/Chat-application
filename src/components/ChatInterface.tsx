import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { User, Message } from '../App';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import ChatHeader from './ChatHeader';

interface ChatInterfaceProps {
  socket: Socket | null;
  currentUser: User;
  onLogout: () => void;
  isConnected: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

function ChatInterface({ socket, currentUser, onLogout, isConnected, messages, setMessages, users }: ChatInterfaceProps) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Listen for user events
    socket.on('user_joined', (user: User) => {
      const systemMessage: Message = {
        id: Date.now(),
        text: `${user.username} joined the chat`,
        user: { id: 'system', username: 'System', avatar: '🤖', status: 'offline' },
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('user_left', (user: User) => {
      const systemMessage: Message = {
        id: Date.now(),
        text: `${user.username} left the chat`,
        user: { id: 'system', username: 'System', avatar: '🤖', status: 'offline' },
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    // Listen for typing indicators
    socket.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(username);
        } else {
          newSet.delete(username);
        }
        return newSet;
      });
    });

    return () => {
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
    };
  }, [socket, setMessages]);

  const handleSendMessage = (text: string) => {
    if (socket && text.trim()) {
      socket.emit('send_message', { text });
    }
  };

  const handleTypingStart = () => {
    if (socket) {
      socket.emit('typing_start');
    }
  };

  const handleTypingStop = () => {
    if (socket) {
      socket.emit('typing_stop');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          currentUser={currentUser}
          onLogout={onLogout}
          isConnected={isConnected}
          userCount={users.length}
          onToggleUsers={() => setShowUserList(!showUserList)}
        />
        
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList 
            messages={messages}
            currentUser={currentUser}
            typingUsers={typingUsers}
          />
          <div ref={messagesEndRef} />
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            disabled={!isConnected}
          />
        </div>
      </div>

      <UserList 
        users={users}
        currentUser={currentUser}
        isVisible={showUserList}
        onClose={() => setShowUserList(false)}
      />
    </div>
  );
}

export default ChatInterface;
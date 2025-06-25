import React from 'react';
import { Message } from '../App';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm px-4 py-2 rounded-full shadow-md animate-fade-in">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex gap-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-lg shadow-md border-2 border-white">
              {message.user.avatar}
            </div>
          </div>
        )}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <div className="text-xs text-gray-500 mb-1 px-3 font-semibold">
              {message.user.username}
            </div>
          )}
          <div
            className={`px-5 py-3 rounded-2xl shadow-lg text-base font-medium break-words ${
              isOwn
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
            }`}
          >
            <p>{message.text}</p>
          </div>
          <div className="text-xs text-gray-400 mt-1 px-2 font-mono">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
import React from 'react';
import { MessageCircle, Users, LogOut, Wifi, WifiOff } from 'lucide-react';
import { User } from '../App';

interface ChatHeaderProps {
  currentUser: User;
  onLogout: () => void;
  isConnected: boolean;
  userCount: number;
  onToggleUsers: () => void;
}

function ChatHeader({ currentUser, onLogout, isConnected, userCount, onToggleUsers }: ChatHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between shadow-md rounded-t-3xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-white drop-shadow" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow">BuzzLine</h1>
        </div>
        <div className="hidden lg:flex items-center gap-3 ml-8 bg-white/20 px-4 py-1.5 rounded-full">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-300" />
              <span className="text-white font-semibold">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-200" />
              <span className="text-white font-semibold">Disconnected</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleUsers}
          className="flex items-center gap-2 px-4 py-2 text-base text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors shadow-sm lg:hidden"
        >
          <Users className="w-5 h-5" />
          <span className="font-semibold">{userCount}</span>
        </button>
        <div className="flex items-center gap-3 bg-white/20 px-4 py-1.5 rounded-full">
          <span className="text-3xl drop-shadow">{currentUser.avatar}</span>
          <span className="text-base font-semibold text-white hidden sm:inline drop-shadow">
            {currentUser.username}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-base text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-md font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
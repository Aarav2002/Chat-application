import React, { useState } from 'react';
import { MessageCircle, User, Palette, Wifi, WifiOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userData: { username: string; password: string; avatar: string }) => void;
  isConnected: boolean;
  loginError?: string | null;
}

const avatarOptions = [
  '🚀', '🎯', '🌟', '🎨', '🎭', '🎪', '🎵', '🎮',
  '🏆', '💎', '🔥', '⚡', '🌈', '🦄', '🐱', '🐶'
];

function LoginForm({ onLogin, isConnected, loginError }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !isConnected) return;

    setIsLoading(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      onLogin({
        username: username.trim(),
        password: password.trim(),
        avatar: selectedAvatar
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md border border-blue-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mb-4 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome to ChatRoom</h1>
          <p className="text-gray-500">Join the conversation and connect with others</p>
        </div>

        {loginError && (
          <div className="mb-4 text-red-600 text-center font-medium">
            {loginError}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mb-6">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-semibold">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 font-semibold">Connecting...</span>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-gray-50"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-gray-50"
              maxLength={32}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-1" />
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-10 h-10 rounded-xl text-2xl shadow-sm border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    selectedAvatar === avatar
                      ? 'bg-blue-100 border-blue-500 scale-110 ring-2 ring-blue-400'
                      : 'bg-gray-100 border-transparent hover:bg-blue-50'
                  }`}
                  aria-label={`Choose avatar ${avatar}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || !isConnected || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Joining...
              </>
            ) : (
              'Join Chat Room'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          Real-time chat powered by <span className="font-semibold text-blue-500">Socket.IO</span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
import { useEffect, useRef } from 'react';
import { Users, X } from 'lucide-react';
import { User } from '../App';

interface UserListProps {
  users: User[];
  currentUser: User;
  isVisible: boolean;
  onClose: () => void;
}

function UserList({ users, currentUser, isVisible, onClose }: UserListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [users]);

  return (
    <>
      {/* Mobile overlay */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300" onClick={onClose} />
      )}
      
      {/* User list sidebar */}
      <div className={`
        fixed right-0 top-0 h-full w-80 bg-white/80 backdrop-blur-lg border-l border-blue-100 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        lg:relative lg:translate-x-0 lg:z-auto
        ${isVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-blue-100 flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 rounded-tr-3xl">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="font-bold text-lg text-blue-700">
              Online Users <span className="ml-1 text-base text-blue-400 font-semibold">({users.length})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-xl transition-colors lg:hidden"
            aria-label="Close user list"
          >
            <X className="w-6 h-6 text-blue-400" />
          </button>
        </div>
        
        <div ref={scrollRef} className="p-4 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.username}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-colors shadow-sm border border-transparent ${
                  user.username === currentUser.username ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300' : 'hover:bg-blue-50'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-2xl shadow border-2 border-white">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow ${user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-blue-900 truncate text-lg">
                      {user.username}
                    </p>
                    {user.username === currentUser.username && (
                      <span className="text-xs text-blue-500 font-bold">(You)</span>
                    )}
                  </div>
                  <p className={`text-xs ${user.status === 'online' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {user.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-8 text-blue-400">
              <Users className="w-10 h-10 mx-auto mb-2 text-blue-200" />
              <p>No users online</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserList;

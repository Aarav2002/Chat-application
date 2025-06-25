import { Message, User } from '../App';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
  typingUsers: Set<string>;
}

function MessageList({ messages, currentUser, typingUsers }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">💬</div>
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.user.username === currentUser.username}
          />
        ))
      )}
      
      {typingUsers.size > 0 && (
        <TypingIndicator typingUsers={Array.from(typingUsers)} />
      )}
    </div>
  );
}

export default MessageList;
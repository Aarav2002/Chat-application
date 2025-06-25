import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Smile, Keyboard as KeyboardIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled: boolean;
}

function MessageInput({ onSendMessage, onTypingStart, onTypingStop, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      handleTypingStop();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleKeyboardInput = (input: string) => {
    setMessage((prev) => prev + input);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-gradient-to-t from-white/80 to-blue-50/60 border-t border-blue-100 p-4 shadow-inner rounded-b-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3 items-center relative">
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="p-2 bg-white/80 rounded-full hover:bg-blue-100 transition-colors"
            tabIndex={-1}
          >
            <Smile className="w-5 h-5 text-blue-400" />
          </button>
          <button
            type="button"
            onClick={() => setShowKeyboard((v) => !v)}
            className="p-2 bg-white/80 rounded-full hover:bg-blue-100 transition-colors"
            tabIndex={-1}
          >
            <KeyboardIcon className="w-5 h-5 text-blue-400" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Connecting..." : "Type your message..."}
          disabled={disabled}
          className="flex-1 px-5 py-3 border border-blue-200 rounded-xl bg-white/80 shadow focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base transition-all"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-lg"
        >
          <Send className="w-5 h-5" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-50">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </div>
        )}
        {showKeyboard && (
          <div className="absolute bottom-16 left-0 z-50">
            <Keyboard
              onKeyPress={handleKeyboardInput}
              theme="hg-theme-default hg-layout-default myTheme"
              layout={{ default: [
                '1 2 3 4 5 6 7 8 9 0',
                'q w e r t y u i o p',
                'a s d f g h j k l',
                'z x c v b n m',
                '{space}'
              ]}}
              display={{ '{space}': 'Space' }}
              buttonTheme={[]}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default MessageInput;
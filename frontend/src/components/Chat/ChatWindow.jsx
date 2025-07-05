// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
  const messages = useSelector((state) => state.chat.messages);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

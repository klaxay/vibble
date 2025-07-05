// src/components/chat/MessageBubble.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message }) => {
  const { user } = useSelector((state) => state.auth);
  const isSentByMe = message.senderId === user.id;

  return (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-2 px-4 rounded-lg max-w-xs text-white text-sm ${
          isSentByMe ? 'bg-blue-500' : 'bg-gray-400'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;

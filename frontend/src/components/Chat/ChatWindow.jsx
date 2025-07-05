import React from 'react';
import MessageInput from './MessageInput';

const ChatWindow = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 overflow-y-auto">
        {/* TODO: map messages here */}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;

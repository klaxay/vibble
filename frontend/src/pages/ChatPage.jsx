import React, { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  useSocket('ws://localhost:3000'); // or your backend port

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;

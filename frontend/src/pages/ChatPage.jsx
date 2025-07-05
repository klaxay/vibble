import React, { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import Sidebar from '../components/Chat/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow';

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

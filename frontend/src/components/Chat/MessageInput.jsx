// src/components/chat/MessageInput.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../store/slices/chatSlice';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const sender = useSelector((state) => state.auth.user);
  const receiver = useSelector((state) => state.chat.currentChatUser);

  const handleSend = () => {
    if (!message.trim() || !socket || !receiver) return;

    const newMessage = {
      type: 'message',
      content: message,
      receiverId: receiver.id,
    };

    socket.send(JSON.stringify(newMessage));
    dispatch(
      addMessage({
        id: Date.now(),
        senderId: sender.id,
        receiverId: receiver.id,
        content: message,
        timestamp: new Date().toISOString(),
        sender,
      })
    );
    setMessage('');
  };

  return (
    <div className="mt-4 flex">
      <input
        className="flex-1 border p-2 rounded-l"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button className="bg-blue-500 text-white p-2 rounded-r" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;

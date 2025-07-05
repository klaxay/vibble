import React, { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // emit through socket
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

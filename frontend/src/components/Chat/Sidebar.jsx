// src/components/chat/Sidebar.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, fetchMessages, setCurrentChatUser } from '../../store/slices/chatSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.chat.contacts);
  const currentUser = useSelector((state) => state.auth.user);
  const currentChatUser = useSelector((state) => state.chat.currentChatUser);

  useEffect(() => {
    dispatch(fetchContacts());
  }, []);

  const handleUserClick = (user) => {
    dispatch(setCurrentChatUser(user));
    dispatch(fetchMessages(user.id));
  };

  return (
    <div className="w-1/4 border-r p-4 bg-white">
      <h2 className="font-bold text-lg mb-4">Chats</h2>
      {contacts
        .filter((u) => u.id !== currentUser.id)
        .map((user) => (
          <div
            key={user.id}
            className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
              currentChatUser?.id === user.id ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleUserClick(user)}
          >
            {user.username}
          </div>
        ))}
    </div>
  );
};

export default Sidebar;

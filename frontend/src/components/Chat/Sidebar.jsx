// src/components/chat/Sidebar.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContacts,
  fetchMessages,
  setCurrentChatUser,
} from '../../store/slices/chatSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { contacts, currentChatUser } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchContacts());
    }
  }, [dispatch, currentUser]);

  const handleUserClick = (user) => {
    if (currentChatUser?.id !== user.id) {
      dispatch(setCurrentChatUser(user));
      dispatch(fetchMessages(user.id));
    }
  };

  return (
    <div className="w-1/4 border-r p-4 bg-white overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Chats</h2>

      {!contacts.length ? (
        <p className="text-gray-500 text-sm">No conversations yet.</p>
      ) : (
        contacts
          .filter((u) => u.id !== currentUser?.id)
          .map((user) => (
            <div
              key={user.id}
              className={`p-2 rounded cursor-pointer mb-1 transition-colors ${
                currentChatUser?.id === user.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleUserClick(user)}
            >
              {user.username}
            </div>
          ))
      )}
    </div>
  );
};

export default Sidebar;

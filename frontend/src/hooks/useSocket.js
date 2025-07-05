// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket, setOnlineUsers } from '../store/slices/socketSlice';
import { addMessage, fetchMessages } from '../store/slices/chatSlice';

export const useSocket = (url) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const currentChatUser = useSelector((state) => state.chat.currentChatUser);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', token }));
      dispatch(setSocket(ws));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        if (data.message.senderId === currentChatUser?.id || data.message.receiverId === currentChatUser?.id) {
          dispatch(addMessage(data.message));
        }
      }

      if (data.type === 'online-users') {
        dispatch(setOnlineUsers(data.users));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [token, currentChatUser]);

  return socketRef.current;
};

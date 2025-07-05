// src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket, setOnlineUsers } from '../store/slices/socketSlice';
import { addMessage } from '../store/slices/chatSlice';

export const useSocket = (url) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const currentChatUser = useSelector((state) => state.chat.currentChatUser);

  useEffect(() => {
    // Do not connect without token
    if (!token || socketRef.current) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connection opened');
      // Authenticate socket with token
      ws.send(JSON.stringify({ type: 'auth', token }));
      dispatch(setSocket(ws));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'message':
            const msg = data.message;

            // Check if the message belongs to the currently open chat
            const isRelevant =
              msg.senderId === currentChatUser?.id ||
              msg.receiverId === currentChatUser?.id;

            if (isRelevant) {
              dispatch(addMessage(msg));
            } else {
              // Optional: trigger a toast or notification here
              console.log('🔔 Message received for another chat:', msg);
            }
            break;

          case 'online-users':
            dispatch(setOnlineUsers(data.users));
            break;

          default:
            console.warn('⚠️ Unknown socket message type:', data.type);
        }
      } catch (err) {
        console.error('❌ Failed to parse socket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      socketRef.current = null;
      dispatch(setSocket(null));
    };

    return () => {
      ws.close();
    };
  }, [token, dispatch]);

  return socketRef.current;
};

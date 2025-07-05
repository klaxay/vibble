import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from '../store/slices/socketSlice';

export const useSocket = (url) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', token }));
      dispatch(setSocket(ws));
    };

    ws.onclose = () => {
      console.log('Socket closed');
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return socketRef.current;
};

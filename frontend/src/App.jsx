import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import { setAuthFromStorage } from './store/slices/authSlice';

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(setAuthFromStorage({ token, user: JSON.parse(user) }));
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout, setAuthFromStorage } from '../store/slices/authSlice';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      dispatch(loginSuccess(data));
      localStorage.setItem('token', data.token);
    } else {
      alert(data.error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col p-6 gap-3 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input className="border p-2" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input className="border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default LoginPage;

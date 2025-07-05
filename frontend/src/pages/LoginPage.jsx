import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/'); // Redirect to chat page after login
    } else {
      alert(data.error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col p-6 gap-3 max-w-sm mx-auto mt-20 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      <input
        className="border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      <input
        className="border p-2 rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Login
      </button>

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-blue-500 hover:underline"
          onClick={handleRegisterRedirect}
        >
          Register here
        </button>
      </p>
    </form>
  );
};

export default LoginPage;

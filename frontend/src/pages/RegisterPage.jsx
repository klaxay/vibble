import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout, setAuthFromStorage } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        // Save to Redux + localStorage
        dispatch(loginSuccess(data));
        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-6 gap-3 max-w-sm mx-auto mt-20 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center">Register</h2>

      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="border p-2 rounded"
        placeholder="Username"
        required
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 rounded"
        placeholder="Password"
        required
      />

      <input
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="border p-2 rounded"
        placeholder="Confirm Password"
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Register
      </button>

      <p className="text-center text-sm">
        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </p>
    </form>
  );
};

export default RegisterPage;

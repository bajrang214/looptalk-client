import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert('Signup successful!');
      navigate('/login'); // redirect to login
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            👁️
          </span>
        </div>

        <div className="relative mb-6">
          <input
            type={showCPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <span
            onClick={() => setShowCPassword(!showCPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            👁️
          </span>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Signup
        </button>
        <p className="mt-4 text-center text-sm">
  Already have an account?{' '}
  <a href="/login" className="text-blue-600 hover:underline">
    Login
  </a>
</p>

      </form>
    </div>
  );
};

export default Signup;

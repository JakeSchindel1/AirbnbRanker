import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simple authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demonstration purposes, use a simple check
    // In a real app, you would validate against a backend
    if (password === 'jerryfan') {
      // Store authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to the main app
      navigate('/app');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-pink-500 flex items-center font-airbnb">
            <span className="mr-2">🏆</span> State Ranker
          </h1>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter Password</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-normal mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-normal"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn; 